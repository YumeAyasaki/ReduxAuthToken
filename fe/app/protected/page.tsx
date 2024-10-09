'use client';

import React from "react";
import { useDispatch, useSelector } from 'react-redux'

import AuthApi from "../api/auth";
import { clearTokens } from "store/authSlice";

export default function ProtectedPage() {
  const auth = useSelector(state => state.auth);

  const temp = async () => {
    try {
      const res = await AuthApi.secret();

      if (res[0] = "Expired access token. Request refresh") {
        const req = {refresh_token: auth.refresh_token}
        
        const res = await AuthApi.refresh(req);
      }
    }
    catch (e) {
      console.log(e);
    }
  }

  React.useEffect(() => {
    temp()
  })
  return (
    <div className="flex h-screen bg-black">
      <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-white">
        You are logged in as 
        <SignOut />
      </div>
    </div>
  );
}

function SignOut() {
  const dispatch = useDispatch()
  
  const handleSignOut = () => {
    dispatch(clearTokens());
    localStorage.clear();
  }
  return (
    <form>
      <button type="submit" onClick={handleSignOut}>Sign out</button>
    </form>
  );
}
