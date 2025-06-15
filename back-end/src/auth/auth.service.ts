import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AccountBalanceQuery, Client } from '@hashgraph/sdk';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async auth(authDto: AuthDto) {
    const { accountId, privateKey } = authDto;

    try {
      const client = Client.forTestnet();
      client.setOperator(accountId, privateKey);

      const accountBalanceQuery = new AccountBalanceQuery().setAccountId(accountId);
      const accountTokenBalanceQueryResponse = await accountBalanceQuery.execute(client);
      accountTokenBalanceQueryResponse.hbars;

      const getUserId = await this.prisma.user.findUnique({
        where: {
          account: accountId 
        }
      })

      const newUser = getUserId ? false : true
      
      return {
        "validAccount": true,
        "newUser": newUser
      };
      
    } catch (error) {
      console.error('Erro de verificação:', error.message);
      return {
        "message": "Erro ao validar conta!"
      };
    }
  }
}
