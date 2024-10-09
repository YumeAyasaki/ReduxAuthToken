"use client";

import React from "react";
import Link from "next/link";
import { message } from "antd";
import { useDispatch, useSelector } from "react-redux";

import AuthApi from "../api/auth";
import { SubmitButton } from "app/submit-button";
import { InSignIn } from "../interface/user";
import { setTokens, clearTokens } from "store/authSlice";

export default function Login() {
  const [form, setForm] = React.useState<InSignIn>({
    email: "",
    password: "",
  });

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      email: e.target.value,
    }));
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      password: e.target.value,
    }));
  };

  const dispatch = useDispatch();
  const auth = useSelector(state => state.auth)

  const handleSignOut = () => {
    dispatch(clearTokens());
    localStorage.clear();
  };

  const temp = async () => {
    try {
      const res = await AuthApi.secret();
      console.log('Secret: ', res);

      if ((res[0] != "Something")) {
        const req = { refresh_token: auth.refreshToken };

        const res = await AuthApi.refresh(req);
        console.log('Refresh: ', res);
        if (!res['access_token']) {
          handleSignOut();
        }
        dispatch(
          setTokens({
            username: auth.username,
            accessToken: res['access_token'],
            refreshToken: auth.refreshToken,
          })
        );
        localStorage.setItem('accessToken', res['access_token']);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const [toggle, setToggle] = React.useState(false);

  React.useEffect(() => {
    const intervalID = setInterval(() => {
      console.log("Auth: ", auth);
      temp();
      setToggle((toggle) => !toggle);
    }, 3000);
    return () => clearInterval(intervalID);
  });

  const handleSignIn = async () => {
    try {
      const res = await AuthApi.signIn(form);
      dispatch(
        setTokens({
          username: res.username,
          accessToken: res.access_token,
          refreshToken: res.refresh_token,
        })
      );
      localStorage.setItem('accessToken', res.access_token);
      message.success("Sign in successfully.");
    } catch (e) {
      console.log(e);
      message.error(e.response.data);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      {!auth.isAuth && (
        <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Sign In</h3>
            <p className="text-sm text-gray-500">
              Use your email and password to sign in
            </p>
          </div>
          <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
            <div>
              <label
                htmlFor="email"
                className="block text-xs text-gray-600 uppercase"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="user@acme.com"
                autoComplete="email"
                value={form.email}
                onChange={handleChangeEmail}
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs text-gray-600 uppercase"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChangePassword}
                required
                className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
              />
            </div>
            <SubmitButton text="Sign in" onClick={handleSignIn} />
            <p className="text-center text-sm text-gray-600">
              {"Don't have an account? "}
              <Link href="/register" className="font-semibold text-gray-800">
                Sign up
              </Link>
              {" for free."}
            </p>
          </div>
        </div>
      )}
      {auth.isAuth && (
        <div className="flex h-screen bg-black">
          <div className="w-screen h-screen flex flex-col space-y-5 justify-center items-center text-white">
            You are logged in as {auth.username}
            <SignOut />
          </div>
        </div>
      )}
    </div>
  );
}

function SignOut() {
  const dispatch = useDispatch();

  const handleSignOut = () => {
    dispatch(clearTokens());
    localStorage.clear();
  };
  return (
    <form>
      <button type="submit" onClick={handleSignOut}>
        Sign out
      </button>
    </form>
  );
}
