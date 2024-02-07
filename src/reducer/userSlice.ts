import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { IBoard } from '../data/type';

interface IUserState {
  userLoggedIn: boolean;
}

const initialUserState: IUserState = {
  userLoggedIn: false
};

export const UserSlice = createSlice({
  name: 'user',
  initialState: initialUserState,
  reducers: {
    setUserLoggedIn:(state, action) => {
      return {
        ...action.payload,
        userLoggedIn: true,
      };
    },
    setUserLoggedOut: (state,action) => {
      return {
        ...action.payload,
        userLoggedIn: false,
      };
    },
  },
});

export const { setUserLoggedIn, setUserLoggedOut } = UserSlice.actions;

export default UserSlice.reducer ;
