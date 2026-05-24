import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getBoardsList, createBoard } from "./boardService";
import { activeAnimations } from "framer-motion";

export const getBoards = createAsyncThunk("board/getBoards", async (userId) => {
  return await getBoardsList(userId);
});

export const createBoardThunk = createAsyncThunk(
  "board/createBoard",
  async ({ data, ownerId }) => {
    return await createBoard(data, ownerId);
  }
);

const boardSlice = createSlice({
  name: "board",
  initialState: {
    boards: {},
    loading: false,
    error: null,
    selectedBoard: null,
  },
  reducers: {
    setSelectedBoard: (state, action) => {
      state.selectedBoard = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getBoards.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getBoards.fulfilled, (state, action) => {
      state.loading = false;
      state.boards = action.payload;
      //   console.log(state.boards);
    });
    builder
      .addCase(getBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log(action.error);
      })
      .addCase(createBoardThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.boards.total += 1;
        state.boards.rows.unshift({ ...action.payload });
      })
      .addCase(createBoardThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        console.log(action.error);
      })
      .addCase(createBoardThunk.pending, (state) => {
        state.loading = true;
      });
  },
});
export const { setSelectedBoard } = boardSlice.actions;
export default boardSlice.reducer;
