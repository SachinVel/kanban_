import React from 'react';
import { useAppDispatch } from '../../hooks/useRedux';
import { type ITab } from '../../data/type';
import { IconBoard } from '../../data/icons';
import { useAppSelector } from '../../hooks/useRedux';
import { setTab } from '../../reducer/boardTabSlice';
import { openModal } from '../../reducer/modalSlice';

const Tab = (props: ITab) => {
  const { tab, addNew, defaultTab } = props;
  const dispatch = useAppDispatch();
  const currentTab = useAppSelector((state) => state.boardTab);
  const active = currentTab ? currentTab === tab : defaultTab;

  if (addNew) {
    return (
      <button
        className='SideNav__tab SideNav__tab--addNew'
        onClick={() => dispatch(openModal({ ModalType: 'AddBoard' }))}
      >
        <IconBoard />+ Create New Board
      </button>
    );
  }
  return (
    <button className={`SideNav__tab ${active ? 'SideNav__tab--active' : ''}`} onClick={() => dispatch(setTab(tab))}>
      <IconBoard />
      {tab}
    </button>
  );
};

export default Tab;
