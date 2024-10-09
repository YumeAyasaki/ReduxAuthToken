'use client';

import axios, { AxiosError } from "axios";

const configuredAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BE,
});

configuredAxios.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem("accessToken");
    config.headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      "Content-Type": "application/json",
    };
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

configuredAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post(`${process.env.NEXT_PUBLIC_BE}auth/refresh/`, {
          refresh_token: refreshToken || "",
        });
        const { access_token } = response.data;
        localStorage.setItem("accessToken", access_token);
        configuredAxios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${access_token}`;
        return configuredAxios(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        localStorage.clear();
        window.location.reload();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error); // For all other errors, return the error as is.
  }
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
