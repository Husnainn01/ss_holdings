"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/admin/Sidebar";
import { Loader2 } from "lucide-react";
import { authAPI } from "@/services/api";
import { getItem, removeItem } from "@/lib/localStorage";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const authCheck = async () => {
      const token = getItem("adminAuth");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      
      try {
        // Verify token with backend
        await authAPI.checkAuth();
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Authentication error:", error);
        // Clear invalid token
        removeItem("adminAuth");
        router.push("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    authCheck();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 overflow-auto lg:pl-64">
        <main className="p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
} 