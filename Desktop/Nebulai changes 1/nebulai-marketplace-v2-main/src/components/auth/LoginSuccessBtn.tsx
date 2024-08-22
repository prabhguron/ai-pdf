"use client";
import React from 'react'
import SuccessTick from '../common/SuccessTick';

const LoginSuccessBtn = () => {
  return (
    <div className="form-group d-flex justify-content-center">
      <button
        className="theme-btn btn-style-one loginSuccessBtn"
        type="button"
        name="sign-in-eth"
      >
        <span className='mr-10 font-weight-bold'>LOGGED IN</span> <SuccessTick height='25' width='25'/>
      </button>
    </div>
  )
}

export default LoginSuccessBtn