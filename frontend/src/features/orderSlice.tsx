import axios from "axios";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { data } from "../pages/myOrders/MyOrders";
import { RequestData } from "../pages/checkout/Checkout";

// API URLs
const createOrderUrl = "http://localhost:8000/api/orders/createOrder";
const getAllOrderUrl = "http://localhost:8000/api/orders/getAllOrdersForUser";
const updateOrderUrl = "http://localhost:8000/api/orders/updateOrder";

// CREATE REVIEWS ASYNC THUNK
export const createOrderAsync = createAsyncThunk(
  "reviews/create",
  async (formData: RequestData) => {
    try {
      const response = await axios.post(createOrderUrl, formData);
      // toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error("Error submitting review:", error);
    }
  }
);

// GET ALL REVIEWS BY PRODUCT ASYNC THUNK
export const getallOrderAsync = createAsyncThunk(
  "reviews/getall",
  async (id: string | undefined) => {
    try {
      const response = await axios.post(getAllOrderUrl, { id });
      // toast.success(response.data.message);
      console.log(response.data);
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.error);
      console.error("Error submitting review:", error);
    }
  }
);

export const updateOrderAsync = createAsyncThunk(
  "reviews/update",
  async (formData: data) => {
    try {
      const response = await axios.post(updateOrderUrl, formData);
      toast.success(response.data.message);
      return response.data;
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
  }
);
interface Image {
  downloadURL: string;
  name: string;
  type: string;
}
interface Product {
  id: string;
  name: string;
  category: string;
  image: Image;
  averageRating: number;
  sale_price: number | undefined;
  price: number;
  stock: number;
}

interface Orders {
  OrderID: string;
  createdAt: Date;
  orderProgress: string;
  totalAmount: number;
  id: string;
  items: Product;
}

// INITIAL STATE
interface ReviewsState {
  loading: boolean;
  allOrders: Orders[];
}

const initialState: ReviewsState = {
  loading: false,
  allOrders: [],
};

const orderSlice = createSlice({
  name: "orderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // GET ALL REVIEWS ADD CASE
      .addCase(getallOrderAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(getallOrderAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      });
  },
});

export default orderSlice.reducer;
