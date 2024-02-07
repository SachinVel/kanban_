import { useEffect, useState } from 'react';
import Header from './layout/Header';
import Main from './layout/Main';
import Modals from './components/Modals';
import { hydrate } from './reducer/dataSlice';
import { closeModal } from './reducer/modalSlice';
import { toggleTheme } from './reducer/dataSlice';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import './App.scss';
import { store, loadStateFromDb } from './store';
import { checkUserLogin, setAuthListener } from "./firebase";

const App = () => {
  const dispatch = useAppDispatch();
  const [isAuthLoaded, setIsAuthLoaded] = useState(false);

  const colorTheme = useAppSelector((state) => state.data.colorTheme);
  const user = useAppSelector((state) => state.user);

  const handleColorTheme = () => {
    return colorTheme === 'dark' ? dispatch(toggleTheme('light')) : dispatch(toggleTheme('dark'));
  };
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      dispatch(closeModal);
    }
  };
  useEffect(() => {
    checkUserLogin().then((user: any) => {
      loadStateFromDb().then((data: any) => {
        let state = JSON.parse(data.state);
        store.dispatch(hydrate(state.data));
        setIsAuthLoaded(true);
        setAuthListener();
      });
      // if (user !== null && user.userLoggedIn) {
      //   loadStateFromDb().then((data: any) => {
      //     let state = JSON.parse(data.state);
      //     store.dispatch(hydrate(state.data));
      //     setIsAuthLoaded(true);
      //     setAuthListener();
      //   });
      // } else {
      //   let emptyBoard = {
      //     data: [],
      //     colorTheme: 'dark'
      //   }
      //   store.dispatch(hydrate(emptyBoard));
      //   setIsAuthLoaded(true);
      //   setAuthListener();
      // }
    }).catch((error) => {
      console.debug('Error in checking user login initially :', error);
      setAuthListener();
    });
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    setIsAuthLoaded(false);
    loadStateFromDb().then((data: any) => {
      let state = JSON.parse(data.state);
      store.dispatch(hydrate(state.data));
      setIsAuthLoaded(true);
      // setAuthListener();
    });
    // if (user !== null && user.userLoggedIn) {
    //   loadStateFromDb().then((data: any) => {
    //     let state = JSON.parse(data.state);
    //     store.dispatch(hydrate(state.data));
    //     setIsAuthLoaded(true);
    //   });
    // } else {
    //   let emptyBoard = {
    //     data: [],
    //     colorTheme: 'dark'
    //   }
    //   store.dispatch(hydrate(emptyBoard));
    //   setIsAuthLoaded(true);
    // }
  }, [user]);

  return (
    <div className={`App ${colorTheme}`}>

      {
        isAuthLoaded &&
        <>
          <Header colorTheme={colorTheme} />
          <Main themeChange={handleColorTheme} />
          <Modals />
        </>
      }

    </div>
  );
};

export default App;
