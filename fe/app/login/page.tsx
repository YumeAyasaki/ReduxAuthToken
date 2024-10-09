"use client";

import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { setTokens, clearTokens } from "store/authSlice";
import { LoginState } from "./login";
import { TodoState } from "./todo";

export interface StoredData {
  username: string;
  access_token: string;
  refresh_token: string;
}

export default function Login() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const handleSignOut = () => {
    dispatch(clearTokens());
    localStorage.clear();
  };

  const handleUpdateAccessToken = (access_token: string) => {
    localStorage.setItem("accessToken", access_token);
  }

  const handleStored = ({username, access_token, refresh_token}: StoredData) => {
    dispatch(
      setTokens({
        username: username,
        accessToken: access_token,
        refreshToken: refresh_token,
      })
    );
    handleUpdateAccessToken(access_token);
    localStorage.setItem('refreshToken', refresh_token);
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      {!auth.isAuth && <LoginState handleStored={handleStored} />}
      {auth.isAuth && <TodoState />}
    </div>
  );
}
