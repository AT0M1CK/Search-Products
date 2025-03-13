import axios, { AxiosRequestConfig } from 'axios';
import { Product } from '../types/product';

const API_URL = 'http://fakestoreapi.in/api/products';

const axiosInstance = axios.create();

export const cancelPreviousRequest = (controller: AbortController | null) => {
  if (controller) {
    controller.abort();
  }
};

export const fetchProducts = async (
  searchQuery: string,
  limit: number = 15,
  page: number = 1,
  signal?: AbortSignal
): Promise<Product[]> => {
  try {
    const config: AxiosRequestConfig = {
      params: {
        limit,
        page,
      },
      signal,
    };

    const response = await axiosInstance.get<Product[]>(API_URL, config);
    const products = response.data;

    if (searchQuery) {
      return products.filter(product =>
        product.title.includes(searchQuery)
      );
    }

    return products;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled:', error.message);
      return [];
    }
    throw error;
  }
};