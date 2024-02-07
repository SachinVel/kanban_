import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './reducer/dataSlice';
import boardTabReducer from './reducer/boardTabSlice';
import modalReducer from './reducer/modalSlice';
import userReducer from './reducer/userSlice';

import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
import { db, getUserId } from './firebase';


export const loadStateFromDb = async () => {

  return new Promise(async (resolve, reject) => {
    try {
      let userId = getUserId();
      if ( userId!==null && userId!==undefined) {

        const docRef = doc(db, "kanban", userId);

        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          resolve(docSnap.data());
        } else {
          let emptyBoard = {
            state:JSON.stringify({
              data: {
                data : [],
                colorTheme : 'dark'
              }
            }),
          }
          await setDoc(doc(db, "kanban", userId), emptyBoard);
          resolve(emptyBoard);
        }
      }else{
        let emptyBoard = {
          state:JSON.stringify({
            data: {
              data : [],
              colorTheme : 'dark'
            }
          }),
        }
        resolve(emptyBoard);
      }

    } catch (e) {
      reject(-2);//exception errorCode
      return undefined;
    }
  })

};

export const saveState = async (state: any) => {
  try {
    let userId = getUserId();
    if (userId!==null && userId!==undefined ) {
      const serializedState = JSON.stringify(state);
      await updateDoc(doc(db, `/kanban/${userId}`), {
        state: serializedState,
      });
    }
  } catch (e) {
    console.error(e);
  }
};

export const store = configureStore({
  reducer: {
    data: dataReducer,
    boardTab: boardTabReducer,
    modal: modalReducer,
    user: userReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
