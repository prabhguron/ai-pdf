"use client"
import { useAppSelector } from '@/redux/store';
import React from 'react'

const RequiredLabel = () => {
  const {userProfileComplete} = useAppSelector(state => state.auth);
  if(userProfileComplete) return null;

  return (
    <h4 className="float-right text-danger fw-bold">(Required)</h4>
  )
}

export default RequiredLabel