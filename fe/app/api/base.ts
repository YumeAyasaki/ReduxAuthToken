import axios, { AxiosError } from "axios";

const configuredAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE,
});

configuredAxios.interceptors.request.use(
  async (config: any) => {
    const token = await localStorage.getItem('accessToken');
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

export async function get<T>(url: string): Promise<T> {
  console.log(url);

  const response = await configuredAxios.get(url);
  return response.data as T;
}

export async function post<T>(url: string, data: any = null): Promise<T> {
  console.log(url);

  const response = await configuredAxios.post(url, data);
  return response.data as T;
}

export async function put<T>(url: string, data: any): Promise<T> {
  console.log(url);

  const response = await configuredAxios.put(url, data);
  return response.data as T;
}

export async function patch<T>(url: string, data: any): Promise<T> {
  console.log(url);

  const response = await configuredAxios.patch(url, data);
  return response.data as T;
}

export async function delele<T>(url: string): Promise<T> {
  console.log(url);

  const response = await configuredAxios.delete(url);
  return response.data as T;
}
