import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createList,
  deleteList,
  getLists,
  updateList,
} from "../list/listService";

export const getListsThunk = createAsyncThunk(
  "list/getLists",
  async (boardId) => {
    return await getLists(boardId);
  }
);

export const createListThunk = createAsyncThunk(
  "list/createList",
  async (data) => {
    return await createList(data);
  }
);

export const deleteListThunk = createAsyncThunk(
  "list/deleteList",
  async (listId) => {
    await deleteList(listId);
    return listId;
  }
);

export const updateListThunk = createAsyncThunk(
  "list/updateList",
  async ({ listId, data }) => {
    return await updateList(listId, data);
  }
);

const listsSlice = createSlice({
  initialState: {
    lists: null,
    loading: false,
    error: null,
  },
  name: "list",
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListsThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getListsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lists = action.payload;
      })
      .addCase(getListsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Create List
      .addCase(createListThunk.fulfilled, (state, action) => {
        if (state.lists) {
          state.lists.rows.push(action.payload);
          state.lists.total += 1;
        }
      })
      // Delete List
      .addCase(deleteListThunk.fulfilled, (state, action) => {
        if (state.lists) {
          state.lists.rows = state.lists.rows.filter(
            (list) => list.$id !== action.payload
          );
          state.lists.total -= 1;
        }
      })
      // Update List
      .addCase(updateListThunk.fulfilled, (state, action) => {
        if (state.lists) {
          const index = state.lists.rows.findIndex(
            (list) => list.$id === action.payload.$id
          );
          if (index !== -1) {
            state.lists.rows[index] = action.payload;
          }
        }
      });
  },
});

export default listsSlice.reducer;
