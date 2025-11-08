"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { api } from "@/envfile/api";
import toast from "react-hot-toast";
import { getCookie, setCookie } from "cookies-next";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const [error, setError] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getCookie("jwtToken");
    if (!token) {
      router.push("/Auth/Login");
    } else {
      router.push("/Home");
    }
  }, [router]);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const res = await axios.post(`${api}/login`, data);

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        setCookie("jwtToken", res.data.token);
        toast.success("Login Successful!");

        setTimeout(() => router.push("/Home"), 1500);
      }
    } catch (err: any) {
      const message = err.response?.data?.error || "Login failed";
      toast.error(`${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <Image
            alt="logo"
            src={require("../../../assests/Logo2.png")}
            width={200}
            height={200}
          />
        </div>

        <h1 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Label
              htmlFor="email"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Email
            </Label>
            <Input
              {...register("email")}
              id="email"
              type="email"
              placeholder="you@example.com"
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <div className="flex flex-col">
            <Label
              htmlFor="password"
              className="mb-1 text-gray-700 dark:text-gray-200"
            >
              Password
            </Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="********"
              className="bg-gray-100 dark:bg-gray-700"
            />
          </div>

          <Button type="submit" className="mt-4 w-full cursor-pointer">
            Login
          </Button>

          {error && (
            <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
          )}
        </form>

        <div className="mt-6 text-center text-gray-500 flex flex-row dark:text-gray-400 text-sm w-full justify-center gap-1">
          Don’t have an account?{" "}
          <div
            onClick={() => {
              router.push("/Auth/Register");
            }}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Register
          </div>
        </div>
      </div>
    </div>
  );
}
