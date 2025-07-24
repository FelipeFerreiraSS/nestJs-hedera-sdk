import { Injectable } from '@nestjs/common';
import { CreateSectionDto } from './dto/create-section.dto';
import { UpdateSectionDto } from './dto/update-section.dto';
import { PrismaService } from 'src/database/prisma.service';
import { AccountCreateTransaction, AccountId, Client, Hbar, PrivateKey, Transaction } from '@hashgraph/sdk';


import { PublicKey } from '@hashgraph/sdk';
import { SmartNodeSdkService } from '@hsuite/smartnode-sdk';
import * as fs from 'fs';
import * as path from 'path';
const STORED_TOPICS_FILE = path.join(process.cwd(), 'stored-topics.json');

@Injectable()
export class SectionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly smartNodeSdk: SmartNodeSdkService,
  ) {}

  async create(createSectionDto: CreateSectionDto) {
    const { name, userId} = createSectionDto

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

  publicKeyTeste = '302a300506032b6570032100803210f46d487ed3c3191b379139371fdc086686d021eb4d4379567fd6bddd24';
  private coinflipTopicId: string;
  private cachedValidatorTimestamp: string;
  private readonly smartNodeSdkService: SmartNodeSdkService

  private readonly operator = {
    accountId: '0.0.6179391',
    privateKey: '302e020100300506032b657004220420cea8e848b02c7bcb2cf3e2fa488c06917bf6f1aed813192db5479c31ab3b10e6',
    publicKey: '302a300506032b6570032100005246c937a05a565181ab67ef890465f90f02f83f1ebc5d01be5f74bc9d1138'
  }

  private readonly betTopicsValidator = {
    "smartNodeSecurity": "full",
    "actionsConditions": {
      "values": [
        "update",
        "delete",
        "message"
      ],
      "controller": "owner"
    },
    "updateConditions": {
      "values": [
        "memo"
      ],
      "controller": "owner"
    },
    "tokenGates": {
      "fungibles": {
        "tokens": []
      },
      "nonFungibles": {
        "tokens": [
          {
            "tokenId": "0.0.6341729",
            "serialNumbers": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            "timeRange": {
              "from": 0,
              "to": 0
            }
          }
        ]
      },
      "timeRange": {
        "from": 0,
        "to": 0
      }
    },
    "customInterface": {
      "interfaceName": "Player",
      "properties": {
        "transactionId": "string",
        "betChoices": "array",
        "playerAccount": "string",
        "betAmount": "number"
      }
    }
  }

  async getNodeStatus() {
    const status = await this.smartNodeSdk.sdk.smartNode.general.getStatus();
    return console.log('getNodeStatus', status);
  }

  getClient(): Client {
    const myAccountId = '0.0.6136725';
    const myPrivateKey = '302e020100300506032b65700422042030c3f597f0b2e7e55711d68d959e65d271ffdaf1db8c1121a1390783c65f9e17';

    if (!myAccountId || !myPrivateKey) {
      throw new Error('MY_ACCOUNT_ID_ECDSA and MY_PRIVATE_KEY_ECDSA must be present');
    }

    const client = Client.forTestnet();
    client.setOperator(myAccountId, myPrivateKey);

    return client;
  }

  private client = this.getClient();

  async teste(payload: any) {
    const { walletId, message, signature } = payload;

    try {
      console.log('📨 Dados recebidos:', payload);
  
      const publicKey = PublicKey.fromString(this.publicKeyTeste)
      const isValid = publicKey.verify(
        Buffer.from(JSON.stringify(message)),
        Buffer.from(signature, 'base64')
      );
  
      if (!isValid) {
        console.log('❌ Assinatura inválida');
        throw new Error('Assinatura inválida');
      } else {
        console.log('✅ Assinatura valida');
      }

      const betTopicId = await this.getBetTopicId();

      console.log('betTopicId', betTopicId);
      
      return {
        status: 'ok',
        received: {
          walletId,
          message,
          signatureValid: isValid,
        },
      }

    } catch (error) {
      console.log(`⚠️ Erro ${error.message}`);
      
      throw error;
    }

  }

   async getBetTopicId(): Promise<string> {
    if (!this.coinflipTopicId) {
      this.coinflipTopicId = await this.createCoinflipTopic();
    } else {
      this.updateTopicsLastUsed();
    }
    return this.coinflipTopicId;
  }

   private updateTopicsLastUsed(): void {
    const storedTopics = this.loadStoredTopics();
    if (storedTopics) {
      storedTopics.lastUsedAt = new Date().toISOString();
      this.saveStoredTopics(storedTopics);
    }
  }

  private saveStoredTopics(topics: any): void {
    const dir = path.dirname(STORED_TOPICS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(STORED_TOPICS_FILE, JSON.stringify(topics, null, 2));
  }

  private loadStoredTopics(): any {
    if (!fs.existsSync(STORED_TOPICS_FILE)) {
      return null;
    }
    const data = fs.readFileSync(STORED_TOPICS_FILE, 'utf8');
    return JSON.parse(data);
  }

  async createCoinflipTopic(): Promise<string> {
    if (this.coinflipTopicId) {
      this.updateTopicsLastUsed(); // Update last used timestamp
      return this.coinflipTopicId;
    }

    console.log('⏲️ Creating official coinflip game topic...');

    const memo = 'Smart App - Official Coinflip Game Topic'
    const topicId = await this.createTopic(memo);

    this.coinflipTopicId = topicId;
    console.log(`✅ Official coinflip topic created: ${topicId}`);

    const storedTopics = {
      validatorTimestamp: "1752517090.3040872",
      coinflipTopicId: topicId,
      createdAt: new Date().toISOString(),
      lastUsedAt: new Date().toISOString(),
    };

    this.saveStoredTopics(storedTopics);
    return topicId;
  }

  async createTopic(memo: string): Promise<string> {
    console.log('⁉️ SmartNodeSdkService:', this.smartNodeSdkService);
    const validatorTimestamp = await this.saveTopicValidator();

    const createTopicTxBytes = await this.smartNodeSdkService.sdk.hashgraph.hcs.createTopic({
      memo,
      validatorConsensusTimestamp: validatorTimestamp,
    });

    // Convert bytes to transaction object
    const createTopicTx = Transaction.fromBytes(
      new Uint8Array(Buffer.from(createTopicTxBytes))
    );
    
    // Sign the transaction with operator key
    const signedTx = await createTopicTx.sign(
      PrivateKey.fromStringDer(this.operator.privateKey)
    );
    
    // Execute the transaction and get receipt
    const txResponse = await signedTx.execute(this.client);
    const receipt = await txResponse.getReceipt(this.client);
    
    // Return the new topic ID
    return receipt.topicId?.toString() ?? "";
  }

  async saveTopicValidator(): Promise<string> {
    if (this.cachedValidatorTimestamp) {
      return this.cachedValidatorTimestamp;
    }

    const validatorConsensusTimestamp = await this.smartNodeSdkService.sdk.smartNode.validators
      .addConsensusValidator(this.betTopicsValidator as any);

    // Cache the validator timestamp for future use
    this.cachedValidatorTimestamp = validatorConsensusTimestamp.toString();

    return validatorConsensusTimestamp.toString();
  }

  async findAll() {
    const allSections = await this.prisma.section.findMany()

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
