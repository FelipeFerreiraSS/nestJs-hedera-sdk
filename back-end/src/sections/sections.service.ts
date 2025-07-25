import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from 'src/database/prisma.service';
import { AccountCreateTransaction, AccountId, Client, Hbar, PrivateKey } from '@hashgraph/sdk';

@Injectable()
export class SectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createSectionDto: CreateSectionDto) {
    const { name, userId, accountId, privateKey} = createSectionDto

    const getUserId = await this.prisma.user.findUnique({
      where: {
        id: userId
      }
    })
    
    if (!getUserId) {
      return {
        "message": "userId não encontrado no sistema" 
      }
    }

    if (!accountId && !privateKey) {
      return {
        "message": "accountId e privateKey não encontrados" 
      }
    }

    const ACCOUNT_ID = AccountId.fromString(accountId);
    const PRIVATE_KEY = PrivateKey.fromStringED25519(privateKey);

    let client = Client.forTestnet();

    client.setOperator(ACCOUNT_ID, PRIVATE_KEY);

    const newAccountPrivateKey = PrivateKey.generateED25519();
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

    return this.prisma.section.create({
      data: {
        account: newAccountId,
        name,
        privateKey: newAccountPrivateKey.toString(),
        user: {
          connect: { id: userId }
        }
      }
    })
  }

  async findAll(userId: string) {
    const allSections = await this.prisma.section.findMany({
      where: {
        userId: Number(userId)
      },
    });

    return allSections;
  }

  async findOne(id: number) {
    const getSectionId = await this.prisma.section.findUnique({
      where: {
        id
      }
    })
    
    if (!getSectionId) {
      return {
        "message": "id não encontrado no sistema" 
      }
    }

    return getSectionId;
  }

  update(id: number, updateSectionDto: UpdateSectionDto) {
    return `This action updates a #${id} section`;
  }

  async remove(id: number) {
    await this.prisma.section.delete({
      where: {
        id
      }
    })
    return {
      "message": `Sections ID: ${id} deletado com sucesso!` 
    };
  }
}
