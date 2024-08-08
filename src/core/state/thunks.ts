import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { StepDetail, Post, Category } from "../../types/apiTypes.type"; // Adjust the import based on your actual file path

const API_BASE_URL = "https://your-api-base-url.com"; // Replace with your actual API base URL

export const fetchStepDetail = createAsyncThunk<StepDetail>(
  "stepDetail/fetch",
  async () => {
    const response = await axios.get<StepDetail>(`${API_BASE_URL}/step-detail`);
    return response.data;
  }
);

export const fetchPost = createAsyncThunk<Post>("post/fetch", async () => {
  const response = await axios.get<Post>(`${API_BASE_URL}/post`);
  return response.data;
});

export const fetchCategory = createAsyncThunk<Category[]>(
  "category/fetch",
  async () => {
    const response = await axios.get<Category[]>(`${API_BASE_URL}/category`);
    return response.data;
  }
);
