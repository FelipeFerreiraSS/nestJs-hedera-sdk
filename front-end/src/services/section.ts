import api from "@/constants/api";
import axios from "axios";
import services from ".";

const baseURL = api.API_BASE_URL

const fetchAll = async () => {
    try {
      const response = await axios.get(`${baseURL}/section`);

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
    const response = await axios.post(`${baseURL}/section`, {
        name,
        userId: Number(services.localSotageServices.getToken().storedUserId)
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