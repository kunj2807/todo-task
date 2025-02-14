import { createSlice, createAsyncThunk, current } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/es/storage";

export const addTask = createAsyncThunk('auth/addTask', async (data, { rejectWithValue, getState }) => {
    try {
        const { auth: authState, task: taskState } = getState()

        const { title, dueDate, description } = data

        const taksIds = taskState.allTasks.map(item => item.id);
        
        const taskId = taksIds.length ? Math.max(...taksIds) + 1 : 1;
        const newTask = {
            title, dueDate, description, id: taskId, status: "todo", userId: authState.authUser?.id
        }
        return [...taskState.allTasks, newTask]

    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const getUserTaks = createAsyncThunk('auth/getUserTaks', async (_, { rejectWithValue, getState }) => {
    try {
        const { auth: authState, task: taskState } = getState()
        const userTasks = {}
        taskState.allTasks.map((item) => {
            if (item.userId == authState.authUser?.id) {
                userTasks[item.status] = userTasks[item.status] ? [...userTasks[item.status],item]: [item] 
            }
        })
        
        return userTasks

    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const deleteTask = createAsyncThunk('auth/deleteTask', async (taskId, { rejectWithValue, getState }) => {
    try {
        const { task: taskState } = getState()
        const index = taskState.allTasks.findIndex(item=>item.id == taskId)   
        if(index==-1){
            return rejectWithValue('Task not found')
        }      
        const taskClone =[...taskState.allTasks];
        taskClone.splice(index,1)
        return taskClone

    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const updateTask = createAsyncThunk('auth/updateTask', async (data, { rejectWithValue, getState }) => {
    try {
        const { task: taskState } = getState()
        const index = taskState.allTasks.findIndex(item=>item.id == data.id)   
        if(index==-1){
            return rejectWithValue('Task not found')
        }      
        const taskClone =[...taskState.allTasks];
        taskClone.splice(index,1,data)
        return taskClone

    } catch (error) {
        return rejectWithValue(error.message)
    }
})

export const getTaskById = createAsyncThunk('auth/getTaskById', async (taskId, { rejectWithValue, getState }) => {
    try {
        const { task: taskState } = getState()
        const task = taskState.allTasks.find(item=>item.id == taskId)  
         
        if(!task){
            return rejectWithValue('Task not found')
        }      
        return task
    } catch (error) {
        return rejectWithValue(error.message)
    }
})


export const changeStatus = createAsyncThunk('task/changeStatus', async (data, { rejectWithValue, getState }) => {
    try {
        const state = getState().task
        const { id, status } = data
        const taskIndex = state.allTasks.findIndex(item => item.id == id);
        if (!taskIndex == -1) {
            return rejectWithValue('Invalid Credentials')
        }
        let task = {...state.allTasks[taskIndex]}
        task.status = status
        let newTasks = [...state.allTasks]
        newTasks.splice(taskIndex,1,task)
        return newTasks

    } catch (error) {
        return rejectWithValue(error.message)
    }
})


const taskSlice = createSlice({
    name: "task",
    initialState: {
        allTasks: [],
        userTasks: null,
        currentTask:null,
    },
    reducers: {
        reset(state) {
            state.userTasks = null
            state.currentTask=null
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addTask.fulfilled, (state, action) => {
                state.allTasks = action.payload
            })
            .addCase(deleteTask.fulfilled, (state, action) => {
                state.allTasks = action.payload
            })
            .addCase(getUserTaks.fulfilled, (state, action) => {
                state.userTasks = action.payload
                state.currentTask=null
            })
            .addCase(updateTask.fulfilled, (state, action) => {
                state.allTasks = action.payload
            })
            .addCase(getTaskById.fulfilled, (state, action) => {
                state.currentTask = action.payload
            })
            .addCase(changeStatus.fulfilled, (state, action) => {
                state.allTasks = action.payload
            })
    }
})

const config = {
    key: "task",
    storage
}
export const { reset } = taskSlice.actions
export default persistReducer(config, taskSlice.reducer)