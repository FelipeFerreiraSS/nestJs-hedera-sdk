import api from "@/constants/api";
import axios from "axios";
import services from ".";

const baseURL = api.API_BASE_URL

const fetchAll = async () => {
    try {
      const localSotage = services.localSotageServices.getLocalSotage();
      
      const response = await axios.get(`${baseURL}/section`, {
        params: {
          userId: localSotage.storedUserId,
        },
      });

      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      throw new Error(err.response.data.message);
    }
  };

type CriateSectionParams = {
  name: string
};
const criateSection = async (params: CriateSectionParams) => {
  try {
    const { name } = params

    const localSotage = services.localSotageServices.getLocalSotage()

    const response = await axios.post(`${baseURL}/section`, {
        name,
        userId: Number(localSotage.storedUserId),
        accountId: localSotage.storedAccountId,
        privateKey: localSotage.storedPrivateKey
      });

    return response;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    throw new Error(err.response.data.message);
  }
};

const section = {
  fetchAll,
  criateSection
};

export default section;