import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaService } from './database/prisma.service';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SectionsModule } from './sections/sections.module';

@Module({
  imports: [UsersModule, AuthModule, SectionsModule],
  controllers: [AppController],
  providers: [PrismaService, AppService],
})
export class AppModule {}
