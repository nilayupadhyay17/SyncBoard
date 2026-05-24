import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createTask,
    deleteTask,
    getTasks,
    updateTask,
} from "../task/taskService";

export const getTasksThunk = createAsyncThunk(
    "task/getTasks",
    async (listId) => {
        const response = await getTasks(listId);
        return { listId, tasks: response.rows };
    }
);

export const createTaskThunk = createAsyncThunk(
    "task/createTask",
    async (data) => {
        return await createTask(data);
    }
);

export const deleteTaskThunk = createAsyncThunk(
    "task/deleteTask",
    async (taskId) => {
        await deleteTask(taskId);
        return taskId;
    }
);

export const updateTaskThunk = createAsyncThunk(
    "task/updateTask",
    async ({ taskId, data }) => {
        return await updateTask(taskId, data);
    }
);

const taskSlice = createSlice({
    name: "task",
    initialState: {
        tasks: {}, // Object where key is listId and value is array of tasks
        loading: false,
        error: null,
    },
    reducers: {
        moveTask: (state, action) => {
            const { sourceListId, destListId, sourceIndex, destIndex } =
                action.payload;
            const sourceList = state.tasks[sourceListId];
            const destList = state.tasks[destListId];

            if (sourceList && destList) {
                if (sourceListId === destListId) {
                    // Reorder in same list
                    const [movedTask] = sourceList.splice(sourceIndex, 1);
                    sourceList.splice(destIndex, 0, movedTask);
                } else {
                    // Move to different list
                    const [movedTask] = sourceList.splice(sourceIndex, 1);
                    movedTask.listId = destListId; // Update listId
                    destList.splice(destIndex, 0, movedTask);
                }
            }
        },
    },
    extraReducers: (builder) => {
        builder
            // Get Tasks
            .addCase(getTasksThunk.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasksThunk.fulfilled, (state, action) => {
                state.loading = false;
                const { listId, tasks } = action.payload;
                state.tasks[listId] = tasks;
            })
            .addCase(getTasksThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create Task
            .addCase(createTaskThunk.fulfilled, (state, action) => {
                const listId = action.payload.listId;
                if (state.tasks[listId]) {
                    state.tasks[listId].unshift(action.payload);
                } else {
                    state.tasks[listId] = [action.payload];
                }
            })
            // Delete Task
            .addCase(deleteTaskThunk.fulfilled, (state, action) => {
                for (const listId in state.tasks) {
                    state.tasks[listId] = state.tasks[listId].filter(
                        (task) => task.$id !== action.payload
                    );
                }
            })
            // Update Task
            .addCase(updateTaskThunk.fulfilled, (state, action) => {
                const listId = action.payload.listId;
                if (state.tasks[listId]) {
                    const index = state.tasks[listId].findIndex(
                        (task) => task.$id === action.payload.$id
                    );
                    if (index !== -1) {
                        state.tasks[listId][index] = action.payload;
                    }
                }
            });
    },
});

export const { moveTask } = taskSlice.actions;
export default taskSlice.reducer;
