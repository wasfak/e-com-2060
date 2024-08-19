"use client";
import React, { useEffect, useState } from "react";

import {
  ShoppingCartIcon,
  LayoutDashboard,
  ShoppingBagIcon,
  TagIcon,
} from "lucide-react";
import { RiDashboard3Fill } from "react-icons/ri";

import { IoHomeSharp, IoStorefrontSharp } from "react-icons/io5";
import { MdViewCompactAlt } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const routes = [
  {
    label: "Dashboard",
    icon: RiDashboard3Fill,
    href: "/dashboard",
  },

  {
    label: "Products",
    icon: ShoppingBagIcon,
    href: "/dashboard/products",
  },
  {
    label: "Orders",
    icon: ShoppingCartIcon,
    href: "/dashboard/orders",
  },
  {
    label: "Categories",
    icon: LayoutDashboard,
    href: "/dashboard/categories",
  },
  {
    label: "Home",
    icon: IoHomeSharp,
    href: "/",
  },
  {
    label: "View Products",
    icon: MdViewCompactAlt,
    href: "/Products",
  },
  {
    label: "Store Management",
    icon: IoStorefrontSharp,
    href: "/dashboard/store",
  },
] as const;

export default function DashboardSideBar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return "";
  }

  return (
    <div className="relative space-y-4 py-4 flex flex-col bg-gray-900 text-gray-100 h-screen">
      <div className="px-3 py-2 flex-1">
        <div className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.href;
            const IconComponent = route.icon;
            return (
              <div key={route.href} className="relative">
                <Link
                  href={route.href}
                  className={`text-sm group flex p-3 w-full justify-start font-medium cursor-pointer transition ${
                    isActive ? "text-gray-900 bg-gray-100 rounded-lg" : ""
                  }`}
                >
                  <div className="flex items-center flex-1 space-x-3">
                    <IconComponent className="text-lg" />
                    <span>{route.label}</span>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
