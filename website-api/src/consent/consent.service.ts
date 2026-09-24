import { Injectable } from "@nestjs/common";
import type { ConsentBody, ConsentReceipt } from "./consent.contract";
import { ConsentRepository } from "./consent.repository";

@Injectable()
export class ConsentService {
  constructor(private readonly repository: ConsentRepository) {}

  record(body: ConsentBody): Promise<ConsentReceipt> {
    return this.repository.record(body);
  }
}
