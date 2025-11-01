"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  LayoutDashboard,
  Car,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
  ListChecks,
  User,
  Ship,
} from "lucide-react";
import { authAPI } from "@/services/api";
import { getItem, removeItem } from "@/lib/localStorage";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getItem('adminAuth');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const response = await authAPI.checkAuth();
        setUserData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        // If auth fails, redirect to login
        removeItem('adminAuth');
        router.push('/admin/login');
      }
    };

    fetchUserData();
  }, [router]);
  
  // Auto-expand the current section
  useEffect(() => {
    const currentSection = sidebarItems.find(item => 
      pathname.startsWith(item.href) && item.href !== "/admin/dashboard"
    );
    
    if (currentSection && currentSection.subItems) {
      setExpandedItems(prev => 
        prev.includes(currentSection.name) ? prev : [...prev, currentSection.name]
      );
    }
  }, [pathname]);

  const sidebarItems: SidebarItem[] = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Cars",
      href: "/admin/dashboard/cars",
      icon: Car,
      subItems: [
        { name: "All Cars", href: "/admin/dashboard/cars" },
        { name: "Add New Car", href: "/admin/dashboard/cars/new" },
      ],
    },
    {
      name: "Options",
      href: "/admin/dashboard/options",
      icon: ListChecks,
      subItems: [
        { name: "All Options", href: "/admin/dashboard/options" },
        { name: "Car Makes", href: "/admin/dashboard/options/makes" },
        { name: "Body Types", href: "/admin/dashboard/options/bodyTypes" },
        { name: "Fuel Types", href: "/admin/dashboard/options/fuelTypes" },
        { name: "Transmission Types", href: "/admin/dashboard/options/transmissionTypes" },
      ],
    },
    {
      name: "Shipping Schedule",
      href: "/admin/dashboard/shipping-schedule",
      icon: Ship,
      subItems: [
        { name: "All Schedules", href: "/admin/dashboard/shipping-schedule" },
        { name: "Add New Schedule", href: "/admin/dashboard/shipping-schedule/new" },
      ],
    },
    {
      name: "Users",
      href: "/admin/dashboard/users",
      icon: Users,
      subItems: [
        { name: "All Users", href: "/admin/dashboard/users" },
        { name: "Add New User", href: "/admin/dashboard/users/new" },
      ],
    },
    {
      name: "Settings",
      href: "/admin/dashboard/settings",
      icon: Settings,
    },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleExpandItem = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  const isItemActive = (href: string) => {
    if (href === "/admin/dashboard" && pathname === "/admin/dashboard") {
      return true;
    }
    return pathname.startsWith(href) && href !== "/admin/dashboard";
  };

  const handleLogout = () => {
    removeItem("adminAuth");
    router.push('/admin/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleDisplayName = (role: string) => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  return (
    <>
      {/* Mobile menu button (only visible on small screens) */}
      <div className="fixed top-4 left-4 z-30 lg:hidden">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-500 bg-white shadow-sm"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 transform bg-white w-64 shadow-lg transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white h-8 w-8 rounded-md flex items-center justify-center font-bold">
              SS
            </div>
            <span className="ml-3 text-gray-900 font-semibold text-lg">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="mt-6 px-4">
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <div key={item.name} className="mb-1">
                {item.subItems ? (
                  <div>
                    <button
                      onClick={() => toggleExpandItem(item.name)}
                      className={`${
                        isItemActive(item.href)
                          ? "bg-indigo-50 text-indigo-700"
                          : "text-gray-700 hover:bg-gray-50"
                      } group flex items-center justify-between w-full px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    >
                      <div className="flex items-center">
                        <item.icon
                          className={`${
                            isItemActive(item.href)
                              ? "text-indigo-600"
                              : "text-gray-500 group-hover:text-gray-700"
                          } h-5 w-5 mr-2`}
                        />
                        {item.name}
                      </div>
                      <ChevronDown
                        className={`${
                          expandedItems.includes(item.name) ? "rotate-180" : ""
                        } transition-transform duration-200 w-4 h-4 opacity-70`}
                      />
                    </button>

                    {expandedItems.includes(item.name) && (
                      <div className="mt-1 space-y-1 pl-9">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className={`${
                              pathname === subItem.href
                                ? "bg-indigo-50 text-indigo-700"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            } block px-2 py-1.5 text-sm font-medium rounded-md transition-colors`}
                            onClick={() =>
                              isMobileMenuOpen && setIsMobileMenuOpen(false)
                            }
                          >
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`${
                      isItemActive(item.href)
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
                  >
                    <item.icon
                      className={`${
                        isItemActive(item.href)
                          ? "text-indigo-600"
                          : "text-gray-500 group-hover:text-gray-700"
                      } h-5 w-5 mr-2`}
                    />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* User profile and logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
          {loading ? (
            <div className="flex items-center mb-4 px-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse"></div>
              <div className="ml-3">
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              </div>
            </div>
          ) : userData ? (
            <div className="flex items-center mb-4 px-2">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                {getInitials(userData.name)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">{userData.name}</p>
                <p className="text-xs text-gray-500">{getRoleDisplayName(userData.role)}</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center mb-4 px-2">
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Not logged in</p>
                <p className="text-xs text-gray-500">Please login</p>
              </div>
            </div>
          )}
          
          <button
            onClick={handleLogout}
            className="group flex items-center w-full px-2 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-red-50 hover:text-red-700 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2 text-gray-500 group-hover:text-red-600" />
            Logout
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
    </>
  );
} 