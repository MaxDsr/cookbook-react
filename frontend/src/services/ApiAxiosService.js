import axios from "axios";

const AXIOS_DEFAULT_CONFIG = {
  baseURL: import.meta.env.VITE_BASE_API_URL,
  timeout: 30000
};

const ApiAxiosService = axios.create(AXIOS_DEFAULT_CONFIG);


ApiAxiosService.interceptors.response.use(
  (axiosResponse) => {
    return axiosResponse.data;
  },
  async (axiosError) => {
    const status = axiosError.response ? axiosError.response.status : null;
    const config = axiosError.response ? axiosError.response.config : {};
    const errorMessage = axiosError?.response?.data?.message || axiosError;

    throw new Error(errorMessage);
  }
)

export default ApiAxiosService;
