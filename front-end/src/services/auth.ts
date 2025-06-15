import api from "@/constants/api";
import axios from "axios";

const baseURL = api.API_BASE_URL

type LoginParams = {
  accountId: string
  privateKey: string
};
const login = async (params: LoginParams) => {
  try {
    const { accountId, privateKey } = params
    const response = await axios.post(`${baseURL}/auth`, {
      accountId,
      privateKey,
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};


type CreateUserParams = {
  name: string
  accountId: string
};
const createUser = async (params: CreateUserParams) => {
  try {
    const { accountId: account, name } = params
    const response = await axios.post(`${baseURL}/users`, {
      name,
      account
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

type CreateWalletParams = {
  nameNewWallet: string
};
const createWallet = async (params: CreateWalletParams) => {
  try {
    const { nameNewWallet: name } = params
    const response = await axios.post(`${baseURL}/users/new-wallet`, {
      name
    });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

const auth = {
  login,
  createUser,
  createWallet
};

export default auth;