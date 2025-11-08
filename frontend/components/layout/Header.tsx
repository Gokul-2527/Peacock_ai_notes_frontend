"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Moon,
  Sun,
  Search,
  X,
  User,
  LogOut,
  Loader2,
  Calendar,
  Mail,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { api } from "@/envfile/api";
import axiosInstance from "@/envfile/axiosSetup";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSearch } from "@/context/HeaderSearch";
import { deleteCookie } from "cookies-next";
type UserProfile = {
  name: string;
  email: string;
  createdAt: string;
};

const DetailRow: React.FC<{
  label: string;
  value: string | undefined;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-[#212121] rounded-lg">
    <div className="text-indigo-500 dark:text-purple-400">{icon}</div>
    <div className="flex flex-col">
      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </span>
      <span
        className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate"
        title={value}
      >
        {value || "N/A"}
      </span>
    </div>
  </div>
);

export default function Header() {
  const { search, setSearch } = useSearch();
  const [modalOpen, setModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchUserProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(`${api}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(res.data.user);
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 403) {
        toast.error("Session expired, please log in again");
        localStorage.removeItem("token");
        router.push("/Auth/Login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    deleteCookie("jwtToken");
    localStorage.clear();
    setModalOpen(false);
    toast.success("Logged out successfully");
    router.push("/Auth/Login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white dark:bg-[#212121] shadow-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <Image
          src={require("../../assests/Logo2.png")}
          alt="logo"
          width={120}
          height={120}
          className="rounded-full"
        />
      </div>

      <div className="relative w-[500px] hidden md:block">
        <Input
          placeholder="Search title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-10 h-10 bg-gray-100 dark:bg-[#4d4d4d] border-gray-300 dark:border-gray-700 focus:border-indigo-500"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
          size={18}
        />
        {search && (
          <X
            onClick={() => setSearch("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer hover:text-gray-700"
            size={18}
          />
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="rounded-full cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="text-gray-700 hover:text-indigo-500" size={20} />
          ) : (
            <Sun className="text-yellow-400 hover:text-yellow-300" size={20} />
          )}
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="rounded-full cursor-pointer border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => setModalOpen(true)}
        >
          <User className="text-gray-700 dark:text-gray-200" size={20} />
        </Button>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
              Your Account Profile
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-gray-500 dark:text-gray-400 mt-1">
              View your details and manage your session.
            </DialogDescription>
          </DialogHeader>

          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-3">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              <p className="text-sm text-gray-500">Loading user profile...</p>
            </div>
          ) : user ? (
            <div className="space-y-4 pt-4">
              <DetailRow
                label="Full Name"
                value={user.name}
                icon={<User size={16} />}
              />
              <DetailRow
                label="Email Address"
                value={user.email}
                icon={<Mail size={16} />}
              />
              <DetailRow
                label="Member Since"
                value={new Date(user.createdAt).toLocaleDateString()}
                icon={<Calendar size={16} />}
              />
            </div>
          ) : (
            <div className="text-center p-8 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p>User data could not be loaded. Please try logging in again.</p>
            </div>
          )}

          <div className="pt-4">
            <Button
              onClick={handleLogout}
              className="w-full h-10 bg-red-600 cursor-pointer hover:bg-red-700 text-white flex items-center gap-2 transition-colors"
            >
              <LogOut size={18} />
              <span>Log Out</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </header>
  );
}
