import { Module } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { SectionsController } from './sections.controller';
import { PrismaService } from 'src/database/prisma.service';
import { SmartNodeSdkService } from '@hsuite/smartnode-sdk';

@Module({
  controllers: [SectionsController],
  providers: [SectionsService, PrismaService, SmartNodeSdkService],
})
export class SectionsModule {}
