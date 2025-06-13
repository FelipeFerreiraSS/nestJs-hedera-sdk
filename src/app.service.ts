import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserBody } from './dtos/create-user-body';
import { PrismaService } from './database/prisma.service';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AppService {
  constructor(private readonly prisma: PrismaService) {}

  async getHello(body: CreateUserBody) {
    const { name, account } = body;

    const existingUser = await this.prisma.user.findUnique({
      where: { account },
    });

    if (existingUser) {
      throw new BadRequestException('Usuário já cadastrado no sistema');
    }

    return this.prisma.user.create({
      data: {
        id: randomUUID(),
        name,
        account,
      },
    });
  }
}
