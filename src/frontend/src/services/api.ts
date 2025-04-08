import axios from 'axios';

// This will be configurable based on environment
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export interface GenerateImageRequest {
  mood: string;
  size: number;
}

export interface GenerateImageResponse {
  art: string;
}

export const generateImage = async (params: GenerateImageRequest): Promise<GenerateImageResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/ascii-art`, params);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to generate image');
    }
    throw error;
  }
}; 