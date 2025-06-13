import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { name, account } = createUserDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { account },
    });

    if (existingUser) {
      throw new BadRequestException('Usuário já cadastrado no sistema');
    }

    return this.prisma.user.create({
      data: {
        name,
        account,
      },
    });
  }

  async findAll() {
    const allUsers = await this.prisma.user.findMany()

    return allUsers;
  }

  async findOne(id: number) {
    console.log(id);
    
    const getUserId = await this.prisma.user.findUnique({
      where: {
        id
      }
    })

    return getUserId;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updateUser = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        name: updateUserDto.name,
        account: updateUserDto.account
      }
    })
    return updateUser;
  }

  async remove(id: number) {
    await this.prisma.user.delete({
      where: {
        id
      }
    })
    return {
      "message": `Usuario ID: ${id} deletado com sucesso!` 
    };
  }
}
