import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import persistReducer from "redux-persist/es/persistReducer";
import storage from "redux-persist/es/storage";

export const registerUser = createAsyncThunk('auth/register', async (data, { rejectWithValue, getState }) => {
    try {
        const state = getState().auth
        const { name, email, password } = data
        const user = state.allUsers.find(item => item.email == email);
        if (user) {
            return rejectWithValue('Email already exists')
        }
        const userIds = state.allUsers.map(item => item.id);
        const userId = userIds.length ? Math.max(...userIds) + 1 : 1;


        const newUser = {
            name, email, password,id:userId
        }
        localStorage.setItem('user', JSON.stringify(user))
        return {allUsers : [...state.allUsers,newUser], newUser}

    } catch (error) {
        return rejectWithValue(error.message)
    }
})


export const loginUser = createAsyncThunk('auth/login', async (data, { rejectWithValue, getState }) => {
    try {
        const state = getState().auth
        const { email, password } = data
        const user = state.allUsers.find(item => item.email == email && item.password == password);
        if (!user) {
            return rejectWithValue('Invalid Credentials')
        }
        localStorage.setItem('user', JSON.stringify(user))
        return user

    } catch (error) {
        return rejectWithValue(error.message)
    }
})


const authSlice = createSlice({
    name: "auth",
    initialState: {
        allUsers: [],
        authUser: null
    },
    reducers: {
        logout(state) {
            state.authUser = null
            localStorage.removeItem('user')
        }
    },
    extraReducers:(builder)=>{
        builder
        .addCase(registerUser.fulfilled,(state,action)=>{
            state.allUsers = action.payload.allUsers
            state.authUser = action.payload.newUser
        })
        .addCase(loginUser.fulfilled,(state,action)=>{
            state.authUser = action.payload
        })
    }
})

const config={
    key:"auth",
    storage
}
export const {logout}  = authSlice.actions
export default persistReducer(config,authSlice.reducer)