"use client";

import Link from "next/link";
import React from "react";
import { message } from "antd";

import { SubmitButton } from "app/submit-button";
import { InSignUp } from "../interface/user";
import AuthApi from "../api/auth";

export default function Register() {
  const [form, setForm] = React.useState<InSignUp>({
    email: "",
    username: "",
    password: "",
  });

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      email: e.target.value,
    }));
  };

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      username: e.target.value,
    }));
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prevForm) => ({
      ...prevForm,
      password: e.target.value,
    }));
  };

  const handleSignUp = async () => {
    try {
      const res = await AuthApi.signUp(form);
      message.success("Sign up successfully.");
    } catch (e) {
      console.log(e);
      message.error(e.response.data);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
      <div className="z-10 w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 shadow-xl">
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-gray-200 bg-white px-4 py-6 pt-8 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Sign Up</h3>
          <p className="text-sm text-gray-500">
            Create an account with your email and password
          </p>
        </div>
        <div className="flex flex-col space-y-4 bg-gray-50 px-4 py-8 sm:px-16">
          <div>
            <label
              htmlFor="username"
              className="block text-xs text-gray-600 uppercase"
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="username"
              placeholder="yume_ayasaki"
              autoComplete="username"
              value={form.username}
              onChange={handleChangeUsername}
              required
              className="mt-1 block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
            />
          </div>
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
          <SubmitButton text="Sign up" onClick={handleSignUp} />
          <p className="text-center text-sm text-gray-600">
            {"Already have an account? "}
            <Link href="/login" className="font-semibold text-gray-800">
              Sign in
            </Link>
            {" instead."}
          </p>
        </div>
      </div>
    </div>
  );
}
