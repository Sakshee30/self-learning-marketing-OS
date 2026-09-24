import { Module } from "@nestjs/common";
import { ConsentController } from "./consent.controller";
import { ConsentRepository } from "./consent.repository";
import { ConsentService } from "./consent.service";

@Module({
  controllers: [ConsentController],
  providers: [ConsentRepository, ConsentService],
})
export class ConsentModule {}
