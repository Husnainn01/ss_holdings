"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  subItems?: { name: string; href: string }[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

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
      name: "Users",
      href: "/admin/dashboard/users",
      icon: Users,
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

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
        <Link href="/admin/dashboard" className="flex items-center">
          <span className="text-red-600 text-xl font-bold">SS</span>
          <span className="ml-1 text-gray-900 font-semibold">Admin</span>
        </Link>
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-20 transform bg-white w-64 border-r border-gray-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="p-5 border-b border-gray-200">
          <Link href="/admin/dashboard" className="flex items-center">
            <span className="text-red-600 text-2xl font-bold">SS</span>
            <span className="ml-2 text-gray-900 font-semibold">Admin Panel</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => (
            <div key={item.name}>
              {item.subItems ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleExpandItem(item.name)}
                    className={`${
                      isItemActive(item.href)
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    } group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md`}
                  >
                    <item.icon
                      className={`${
                        isItemActive(item.href)
                          ? "text-gray-500"
                          : "text-gray-400 group-hover:text-gray-500"
                      } mr-3 flex-shrink-0 h-5 w-5`}
                    />
                    <span className="flex-1">{item.name}</span>
                    <ChevronDown
                      className={`${
                        expandedItems.includes(item.name) ? "rotate-180" : ""
                      } transition-transform duration-200 w-4 h-4`}
                    />
                  </button>

                  {expandedItems.includes(item.name) && (
                    <div className="pl-10 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`${
                            pathname === subItem.href
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
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
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                  onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}
                >
                  <item.icon
                    className={`${
                      isItemActive(item.href)
                        ? "text-gray-500"
                        : "text-gray-400 group-hover:text-gray-500"
                    } mr-3 flex-shrink-0 h-5 w-5`}
                  />
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <Link
            href="/admin/login"
            onClick={() => {
              // Clear auth token on logout
              localStorage.removeItem("adminAuth");
            }}
            className="group flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            <LogOut className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
            Logout
          </Link>
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