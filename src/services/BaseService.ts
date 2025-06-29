import axios from 'axios';
const BASE_API_URL = 'http://localhost:3000/api/v1';

export default abstract class BaseService {
  protected static createAxiosInstance(endpoint: string) {
    return axios.create({
      baseURL: `${BASE_API_URL}/${endpoint}`,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
         'Accept': 'application/json',
      }
    });
  }

  protected static handleError(error: unknown, message: string): void {
    if (axios.isAxiosError(error)) {
      console.error(`${message}:`, {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
    } else {
      console.error(`${message}:`, error);
    }
  }
}