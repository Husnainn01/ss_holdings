"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const adminAuth = localStorage.getItem("adminAuth");
    
    if (adminAuth) {
      // If authenticated, redirect to dashboard
      router.push("/admin/dashboard");
    } else {
      // If not authenticated, redirect to login
      router.push("/admin/login");
    }
  }, [router]);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700"></div>
    </div>
  );
} 