import { env } from "../config/env";

export type TelemetryEvent = {
  name: string;
  properties?: Record<string, string | number | boolean | null | undefined>;
};

type TelemetrySink = (event: TelemetryEvent) => void;

let sink: TelemetrySink | null = null;

export function registerTelemetrySink(nextSink: TelemetrySink) {
  sink = nextSink;
}

export function track(event: TelemetryEvent) {
  if (sink) {
    sink(event);
    return;
  }

  if (env.appEnv !== "production") {
    console.debug("[telemetry]", event.name, event.properties ?? {});
  }
}

export function trackError(error: Error, context?: Record<string, unknown>) {
  if (env.appEnv !== "production") {
    console.error("[telemetry:error]", error, context);
  }

  track({
    name: "frontend_error",
    properties: {
      errorName: error.name,
      message: error.message
    }
  });
}
