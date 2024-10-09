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
  }



  // const temp = async () => {
  //   try {
  //     const res = await AuthApi.secret();
  //     console.log("Secret: ", res);

  //     if (res[0] != "Something") {
  //       const req = { refresh_token: auth.refreshToken };

  //       const res = await AuthApi.refresh(req);
  //       console.log("Refresh: ", res);
  //       if (!res["access_token"]) {
  //         handleSignOut();
  //       }
  //       dispatch(
  //         setTokens({
  //           username: auth.username,
  //           accessToken: res["access_token"],
  //           refreshToken: auth.refreshToken,
  //         })
  //       );
  //       localStorage.setItem("accessToken", res["access_token"]);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      {!auth.isAuth && <LoginState handleStored={handleStored} />}
      {auth.isAuth && <TodoState />}
    </div>
  );
}
