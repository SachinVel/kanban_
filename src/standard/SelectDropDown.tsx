import React, { useState, useRef } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import { ChevronDown } from '../data/icons';

interface SelectDropDownProps {
  status: string[];
  currentStatus: string | '';
  onSetCurrentStatus: (status: string, index: number) => void;
}

const SelectDropDown = (props: SelectDropDownProps) => {
  const { status, currentStatus, onSetCurrentStatus } = props;
  const [openDropDown, setOpenDropDown] = useState(false);
  const selectDropDownRef = useRef(null);
  const DropDownItem = (props: { item: string; index: number }) => {
    return (
      <button
        type='button'
        className='SelectDropDown__btn'
        onClick={() => handleSetCurrentStatus(props.item, props.index)}
        title={props.item}
      >
        <span className='SelectDropDown__btn-text'>{props.item}</span>
      </button>
    );
  };

  const handleOpenDropDown = () => {
    setOpenDropDown((prev) => !prev);
  };

  const handleSetCurrentStatus = (status: string, index: number) => {
    onSetCurrentStatus(status, index);
    setOpenDropDown(false);
  };

  const handleClickOutside = () => {
    setOpenDropDown(false);
  };

  useOnClickOutside(selectDropDownRef, handleClickOutside);

  return (
    <div className='SelectDropDown' ref={selectDropDownRef}>
      <button type='button' className='SelectDropDown__trigger' onClick={handleOpenDropDown} title={currentStatus}>
        <span className='SelectDropDown__trigger-text'>{currentStatus}</span>
        <span className='SelectDropDown__trigger-icon' style={openDropDown ? { transform: 'rotate(180deg)' } : {}}>
          <ChevronDown />
        </span>
      </button>
      {openDropDown && (
        <div className='SelectDropDown__wrapper'>
          {status.map((item: string, index: number) => (
            <DropDownItem key={index} item={item} index={index} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SelectDropDown;
