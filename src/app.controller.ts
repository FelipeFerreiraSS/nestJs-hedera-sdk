import { Body, Controller, Post } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';

import { CreateUserBody } from './dtos/create-user-body';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly userService: AppService) {}

  @Post()
  async getHello(@Body() body: CreateUserBody) {
    const user = await this.userService.getHello(body);
    return { user };
  }
}
