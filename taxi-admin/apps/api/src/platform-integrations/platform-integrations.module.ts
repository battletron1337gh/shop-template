import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlatformIntegrationsService } from './platform-integrations.service';
import { PlatformIntegrationsController } from './platform-integrations.controller';
import { UberService } from './services/uber.service';
import { BoltService } from './services/bolt.service';
import { QueueModule } from '../queue/queue.module';

@Module({
  imports: [HttpModule, QueueModule],
  providers: [PlatformIntegrationsService, UberService, BoltService],
  controllers: [PlatformIntegrationsController],
  exports: [PlatformIntegrationsService],
})
export class PlatformIntegrationsModule {}
