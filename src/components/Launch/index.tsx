import { useState, MouseEvent, useEffect } from 'react';
import Button from '../../standard/Button';
import { openModal } from '../../reducer/modalSlice';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import DropDown from '../../standard/DropDown';
import useMediaQuery from '../../hooks/useMediaQuery';
import { ChevronDown, IconPlus } from '../../data/icons';
import SideNav from '../SideNav';
import { toggleTheme, hydrate } from '../../reducer/dataSlice';
import { signInWithGooglePopup, logout, getUserName } from "../../firebase";
import { store } from '../../store';

const Launch = () => {
  const dispatch = useAppDispatch();
  const [toggleNav, setToggleNav] = useState(false);
  const board = useAppSelector((state) => state.data.data);
  const boardTab = useAppSelector((state) => state.boardTab);
  const user = useAppSelector((state) => state.user);
  const [userDisplayName, setUserDisplayName] = useState('');

  const hasBoard = board ? board.length > 0 : false;
  const mobileQuery = useMediaQuery('mobile');
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

  const colorTheme = useAppSelector((state) => state.data.colorTheme);
  const handleColorTheme = () => {
    return colorTheme === 'dark' ? dispatch(toggleTheme('light')) : dispatch(toggleTheme('dark'));
  };

  const handleToggleNav = () => {
    setToggleNav((prev) => !prev);
  };

  const handleClickOverlay = (e: MouseEvent) => {
    const target = e.target as Element;
    if (target.className === 'Launch__mobile-sideNav') {
      setToggleNav(false);
    }
  };

  useEffect(() => {
    setIsUserLoggedIn(user.userLoggedIn);
    if (user.userLoggedIn) {
      let userName = getUserName();
      if (userName !== undefined && userName !== null) {
        setUserDisplayName(userName);
      }

    }
  }, [user]);

  const logGoogleUser = () => {
    signInWithGooglePopup().then(() => {
      // store.setUserLoggedIn();
    });
  }


  const signout = () => {
    logout().then(() => {
      let emptyBoard = {
        data: [],
        colorTheme: 'dark'
      }
      store.dispatch(hydrate(emptyBoard));
    }).catch((error) => {
      console.error('Error is logging out : ', error);
    });
  }

  return (
    <div className='Launch'>
      {toggleNav && mobileQuery && (
        <div className='Launch__mobile-sideNav' onClick={(e) => handleClickOverlay(e)}>
          <SideNav themeChange={handleColorTheme} setToggleNav={setToggleNav} />
        </div>
      )}

      {(mobileQuery) ? (
        <button className='Launch__mobile-btn' onClick={handleToggleNav}>
          <span className='Launch__mobile-btn-title'>{boardTab}</span>
          <span className='Launch__mobile-btn-icon' style={toggleNav ? { transform: 'rotate(180deg)' } : {}}>
            <ChevronDown />
          </span>
        </button>
      ) : (
        isUserLoggedIn &&
        <h1 className='Launch__title' title={boardTab}>
          {boardTab}
        </h1>
      )}

      {
        isUserLoggedIn &&
        userDisplayName !== '' &&
        <h3>
          Welcome {userDisplayName}!
        </h3>
      }

      {hasBoard && isUserLoggedIn && (
        <div className='Launch__buttons'>
          {mobileQuery ? (
            <Button small onClick={() => dispatch(openModal({ ModalType: 'AddNewTask' }))}>
              <IconPlus />
            </Button>
          ) : (
            <Button onClick={() => dispatch(openModal({ ModalType: 'AddNewTask' }))}>
              &nbsp; + Add New task &nbsp;
            </Button>
          )}

          <DropDown
            text={'Board'}
            onEdit={() => dispatch(openModal({ ModalType: 'EditBoard', ModalDetail: { type: 'EditBoard' } }))}
            onDelete={() => dispatch(openModal({ ModalType: 'DeleteBoard' }))}
          />
        </div>
      )}

      {
        !hasBoard && isUserLoggedIn &&
        <div className='Launch__buttons'>
          <Button onClick={signout}>logout</Button>
        </div>
      }

      {
        !isUserLoggedIn &&
        <div style={{position: 'absolute', right:'30px'}}>
          <div className='Launch__buttons' style={{ float: 'right' }}>
            <Button onClick={logGoogleUser}>Sign In With Google</Button>
          </div>
        </div>

      }


    </div>
  )
};

export default Launch;
