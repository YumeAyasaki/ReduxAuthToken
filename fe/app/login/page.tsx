'use client';

import React from "react";
import Link from "next/link";
import { message } from "antd";
import { useDispatch } from 'react-redux'

import AuthApi from "../api/auth";
import { SubmitButton } from "app/submit-button";
import { InSignIn } from "../interface/user";
import { setTokens } from 'store/authSlice'

export default function Login() {
  const [form, setForm] = React.useState<InSignIn>({
    email: '',
    password: '',
  });

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
			...prevForm,
			email: e.target.value,
		}));
  }

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
			...prevForm,
			password: e.target.value,
		}));
  }

  const dispatch = useDispatch()

  const handleSignIn = async () => {
    try {
      const res = await AuthApi.signIn(form);
      console.log(res.access_token);
      console.log(res.refresh_token);
      dispatch(setTokens({
        username: res.username,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      }))
      localStorage.setItem('accessToken', res.access_token); // Persist access token
      localStorage.setItem('refreshToken', res.refresh_token); // Persist refresh token
      console.log(res.username);
      message.success("Sign in successfully.");
    } catch (e) {
      console.log(e);
      message.error(e.response.data);
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
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
          <SubmitButton text="Sign in" onClick={handleSignIn}/>
          <p className="text-center text-sm text-gray-600">
            {"Don't have an account? "}
            <Link href="/register" className="font-semibold text-gray-800">
              Sign up
            </Link>
            {" for free."}
          </p>
        </div>
      </div>
    </div>
  );
}
