"use client";
import React from 'react'
import { chatSidebarToggle } from '@/redux/toggle/toggleSlice';
import { useAppDispatch } from '@/redux/store';

const ShortListHamburger = () => {
    const dispatch = useAppDispatch();

    const chatToggle = () => {
      dispatch(chatSidebarToggle());
    };
    return (
      <>
        <button onClick={chatToggle} className="toggle-contact">
          <span className="fa fa-bars"></span>
        </button>
      </>
    );
}

export default ShortListHamburger