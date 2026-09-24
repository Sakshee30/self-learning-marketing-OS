import type { ApiConfig } from "../config/api-config";
import { DatabasePoolService } from "../database/database-pool.service";
import { loadDeliveryWorkerConfig } from "./delivery.config";
import { DeliveryProcessor } from "./delivery.processor";
import { WebhookDeliveryProvider } from "./delivery.provider";
import { DeliveryRepository } from "./delivery.repository";

function sleep(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

export async function runDeliveryWorker() {
  const config = loadDeliveryWorkerConfig();
  const databaseConfig: ApiConfig = {
    databaseUrl: config.databaseUrl,
    databasePoolMax: config.databasePoolMax,
    host: "127.0.0.1",
    port: 3002,
    websiteOrigins: [],
  };

  const database = new DatabasePoolService(databaseConfig);
  const repository = new DeliveryRepository(database);
  const provider = new WebhookDeliveryProvider(config);
  const processor = new DeliveryProcessor(repository, provider, config);
  let stopping = false;

  const stop = () => {
    stopping = true;
  };
  process.once("SIGINT", stop);
  process.once("SIGTERM", stop);

  try {
    while (!stopping) {
      const outcome = await processor.runOnce();
      if (outcome === "idle") await sleep(config.pollIntervalMs);
    }
  } finally {
    await database.onModuleDestroy();
  }
}

if (require.main === module) {
  runDeliveryWorker().catch((error) => {
    const message = error instanceof Error ? error.message : "Unknown delivery worker failure";
    process.stderr.write(`Delivery worker failed: ${message}\n`);
    process.exitCode = 1;
  });
}
