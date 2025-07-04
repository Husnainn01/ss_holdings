"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Car, Users, ShoppingCart, TrendingUp, Plus, ArrowRight, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { dashboardAPI } from '@/services/api';

interface StatsCard {
  title: string;
  value: number | string;
  change: number;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
  color: string;
}

interface ActivityItem {
  id: number;
  action: string;
  car?: string;
  user: string;
  time: string;
  avatar: string;
}

interface DashboardData {
  stats: any;
  topBrands: any[];
  recentActivity: ActivityItem[];
  userActivityStats: any;
  mostActiveUsers: any[];
  sftpUsageStats: any;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {},
    topBrands: [],
    recentActivity: [],
    userActivityStats: { active: 0, inactive: 0 },
    mostActiveUsers: [],
    sftpUsageStats: { chartData: { labels: [], data: [] }, totalStats: {} }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all dashboard data in parallel
        const [
          statsResponse,
          topBrandsResponse,
          recentActivityResponse,
          userActivityStatsResponse,
          mostActiveUsersResponse,
          sftpUsageStatsResponse
        ] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getTopBrands(),
          dashboardAPI.getRecentActivity(5),
          dashboardAPI.getUserActivityStats(),
          dashboardAPI.getMostActiveUsers(4),
          dashboardAPI.getSftpUsageStats(7)
        ]);

        setDashboardData({
          stats: statsResponse.data,
          topBrands: topBrandsResponse.data,
          recentActivity: recentActivityResponse.data,
          userActivityStats: userActivityStatsResponse.data,
          mostActiveUsers: mostActiveUsersResponse.data,
          sftpUsageStats: sftpUsageStatsResponse.data
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Create stats cards from real data
  const statsCards: StatsCard[] = [
    {
      title: "Total Cars",
      value: dashboardData.stats.totalCars || 0,
      change: 12, // You can calculate this from historical data
      trend: "up",
      icon: <Car className="h-6 w-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Pending Actions",
      value: dashboardData.stats.pendingActions || 0,
      change: 2,
      trend: "up",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "bg-yellow-500",
    },
    {
      title: "Recent Logins",
      value: dashboardData.stats.recentLogins || 0,
      change: 1,
      trend: "up",
      icon: <ArrowRight className="h-6 w-6" />,
      color: "bg-indigo-500",
    },
    {
      title: "Total Users",
      value: dashboardData.stats.totalUsers || 0,
      change: 4,
      trend: "up",
      icon: <Users className="h-6 w-6" />,
      color: "bg-green-500",
    },
  ];

  // --- CHART DATA (REAL) ---
  const sftpUsageData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "SFTP Usage (GB)",
        data: [12, 19, 8, 15, 10, 7, 14], // This can be real data when you implement SFTP monitoring
        backgroundColor: "#8A0000",
      },
    ],
  };
  
  const userActivityData = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "Users",
        data: [
          dashboardData.userActivityStats.active || 0, 
          dashboardData.userActivityStats.inactive || 0
        ],
        backgroundColor: ["#FF7D29", "#F4E7E1"],
      },
    ],
  };
  
  const errorLogData = {
    labels: ["Critical", "Warning", "Info"],
    datasets: [
      {
        label: "Errors",
        data: [3, 7, 15], // This can be real data when you implement error logging
        backgroundColor: ["#a62828", "#FF7D29", "#8A0000"],
      },
    ],
  };

  // --- TOP BRANDS (MOCK) ---
  const topBrands = [
    { name: "Toyota", count: 56 },
    { name: "Honda", count: 42 },
    { name: "BMW", count: 31 },
    { name: "Nissan", count: 28 },
    { name: "Mercedes", count: 22 },
  ];

  // --- MOST ACTIVE USERS (MOCK) ---
  const mostActiveUsers = [
    { name: "John Admin", actions: 120 },
    { name: "Sarah Editor", actions: 98 },
    { name: "Mike User", actions: 75 },
    { name: "Anna Staff", actions: 60 },
  ];

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, John! Here's an overview of your car export business.
          </p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/admin/dashboard/cars/new"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 inline-flex items-center text-sm font-medium transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add New Car
          </Link>
        </div>
      </div>

      {/* Stats cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            stat.title === "Pending Actions" ? (
              <Link key={index} href="/admin/dashboard/cars?filter=pending" className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow block">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    <div className={`${stat.color} text-white p-2 rounded-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${stat.trend === 'up' 
                      ? 'bg-green-100 text-green-800' 
                      : stat.trend === 'down' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'}`
                  }>
                    {stat.trend === 'up' ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.title}</div>
                </div>
              </Link>
            ) : (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className={`p-2 rounded-lg ${stat.color} bg-opacity-10`}>
                    <div className={`${stat.color} text-white p-2 rounded-lg`}>
                      {stat.icon}
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                    ${stat.trend === 'up' 
                      ? 'bg-green-100 text-green-800' 
                      : stat.trend === 'down' 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-gray-100 text-gray-800'}`
                  }>
                    {stat.trend === 'up' ? <ArrowUpRight className="mr-1 h-3 w-3" /> : <ArrowDownRight className="mr-1 h-3 w-3" />}
                    {Math.abs(stat.change)}%
                  </span>
                </div>
                <div className="mt-4">
                  <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500 mt-1">{stat.title}</div>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Charts row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">SFTP Server Usage</h3>
          <Bar data={sftpUsageData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">User Activity</h3>
          <Pie data={userActivityData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } } }} />
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-2 text-sm">Error Log</h3>
          <Bar data={errorLogData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        </div>
      </div>

      {/* Main content area - two column layout on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest Cars Added (was Recent Activity) */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-semibold text-lg text-gray-900">Latest Cars Added</h2>
            <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-4"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : (
              dashboardData.recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-medium text-sm mr-4">
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {activity.action} {activity.car && <span className="font-medium">{activity.car}</span>}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Info Panels: Top Brands & Most Active Users */}
        <div className="flex flex-col gap-6">
          {/* Top Brands */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-900">Top Brands</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {dashboardData.topBrands.map((brand, i) => (
                <div key={brand.name} className="flex items-center justify-between px-6 py-3">
                  <span className="font-medium text-gray-700">{brand.name}</span>
                  <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded-full">{brand.count} cars</span>
                </div>
              ))}
            </div>
          </div>
          {/* Most Active Users */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-lg text-gray-900">Most Active Users</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {dashboardData.mostActiveUsers.map((user, i) => (
                <div key={user.name} className="flex items-center justify-between px-6 py-3">
                  <span className="font-medium text-gray-700">{user.name}</span>
                  <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full">{user.actions} actions</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 