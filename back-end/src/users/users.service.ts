import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, CreateWalletDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/database/prisma.service';
import { AccountCreateTransaction, AccountId, Client, Hbar, PrivateKey } from '@hashgraph/sdk';

require('dotenv').config();

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { name, account } = createUserDto;

    return this.prisma.user.create({
      data: {
        name,
        account,
      },
    });
  }

  async createWallet(createWalletDto: CreateWalletDto) {
    const { name } = createWalletDto;

    const MY_ACCOUNT_ID = AccountId.fromString(process.env.MY_ACCOUNT_ID_ED25519 ?? '');
    const MY_PRIVATE_KEY = PrivateKey.fromStringED25519(process.env.MY_PRIVATE_KEY_ED25519 ?? '');

    let client = Client.forTestnet();

    client.setOperator(MY_ACCOUNT_ID, MY_PRIVATE_KEY);

    const newAccountPrivateKey = PrivateKey. generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;

    const newAccount = await new AccountCreateTransaction()
      .setKeyWithoutAlias (newAccountPublicKey)
      .setInitialBalance(Hbar.fromTinybars(10))
      // .setInitialBalance(Hbar.fromTinybars(100000))
      .execute(client);

    const receiptNewAccountTx= await newAccount.getReceipt(client);

    const newAccountId = receiptNewAccountTx.accountId?.toString() ?? '';

    if (!newAccountId) {
      throw new Error('Falha ao criar nova conta Hedera');
    }

    const newWallet = await this.prisma.user.create({
      data: {
        name,
        account: newAccountId,
      },
    });

    const response = {
      account: newWallet.account,
      name: newWallet.name,
      privateKey: newAccountPrivateKey.toString(),
      userId: newWallet.id
    }

    return response
  }

  async findAll() {
    const allUsers = await this.prisma.user.findMany()

    return allUsers;
  }

  async findOne(id: number) {

    const getUserId = await this.prisma.user.findUnique({
      where: {
        id
      }
    })
    
    if (!getUserId) {
      return {
        "message": "userId não encontrado no sistema" 
      }
    }

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
