import axios, { AxiosRequestConfig } from 'axios';
import { Product } from '../types/product';

const API_URL = 'http://fakestoreapi.in/api/products';

// Create a cancelable axios instance
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

    // Filter products based on search query if provided
    if (searchQuery.trim()) {
      return products.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase())
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