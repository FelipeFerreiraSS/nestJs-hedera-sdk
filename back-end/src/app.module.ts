import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './database/prisma.service';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SectionsModule } from './sections/sections.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SmartNodeSdkModule } from '@hsuite/smartnode-sdk';
import { IClient } from '@hsuite/client-types';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    SmartNodeSdkModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        client: configService.getOrThrow<IClient.IOptions>('client')
      })
    }),

    UsersModule,
    AuthModule,
    SectionsModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
