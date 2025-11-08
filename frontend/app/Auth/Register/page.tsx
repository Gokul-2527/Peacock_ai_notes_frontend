"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { api } from "@/envfile/api";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
};

export default function RegisterPage() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const [error, setError] = useState("");
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await axios.post(`${api}/register`, data);

      if (res.data?.user) {
        toast.success("Registration successful! Redirecting to login...");
        setError("");

        setTimeout(() => {
          router.push("/Auth/Login");
        }, 1500);
      }
    } catch (err: any) {
      const msg = err.response?.data?.error || "Registration failed";
      setError(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Toaster />
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            alt="logo"
            src={require("../../../assests/Logo2.png")}
            width={200}
            height={200}
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Name
            </label>
            <Input
              {...register("name")}
              id="name"
              placeholder="Your Name"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Email
            </label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="********"
              className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <Button type="submit" className="mt-4 w-full cursor-pointer">
            Register
          </Button>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>

        <div className="mt-6 text-center text-gray-500 dark:text-gray-400 text-sm flex flex-row gap-1 w-full justify-center">
          Already have an account?
          <div
            onClick={() => router.push("/Auth/Login")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Login
          </div>
        </div>
      </div>
    </div>
  );
}
