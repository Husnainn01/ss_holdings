"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Users, ShoppingCart, TrendingUp } from "lucide-react";

interface StatsCard {
  title: string;
  value: number | string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const statsCards: StatsCard[] = [
    {
      title: "Total Cars",
      value: 234,
      change: "+12% from last month",
      icon: <Car className="h-6 w-6" />,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Active Users",
      value: 1258,
      change: "+4% from last month",
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Total Sales",
      value: "$123,456",
      change: "+18% from last month",
      icon: <ShoppingCart className="h-6 w-6" />,
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Monthly Revenue",
      value: "$28,429",
      change: "+8% from last month",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-yellow-50 text-yellow-600",
    },
  ];

  // Mock recent activity data
  const recentActivity = [
    { id: 1, action: "New car added", car: "Toyota Camry 2023", user: "John Admin", time: "2 hours ago" },
    { id: 2, action: "Car updated", car: "Honda Civic 2022", user: "Sarah Editor", time: "4 hours ago" },
    { id: 3, action: "Car sold", car: "BMW X5 2023", user: "John Admin", time: "1 day ago" },
    { id: 4, action: "New user registered", car: "", user: "Mike User", time: "2 days ago" },
    { id: 5, action: "Car deleted", car: "Mercedes S-Class 2021", user: "John Admin", time: "3 days ago" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div>
          <Link 
            href="/admin/dashboard/cars/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Add New Car
          </Link>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm h-32 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="font-medium text-gray-500">{stat.title}</div>
                <div className={`p-2 rounded-md ${stat.color}`}>{stat.icon}</div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.change}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-semibold text-lg">Recent Activity</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Car
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : (
                recentActivity.map((activity) => (
                  <tr key={activity.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.car || "-"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {activity.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {activity.time}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 