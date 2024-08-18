"use client";
import React, { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import {
  ShoppingCartIcon,
  LayoutDashboard,
  ShoppingBagIcon,
  TagIcon,
} from "lucide-react";
import { RiDashboard3Fill } from "react-icons/ri";
import { Montserrat } from "next/font/google";
import { IoHomeSharp, IoStorefrontSharp } from "react-icons/io5";
import { MdViewCompactAlt } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });

const routes = [
  {
    label: "Dashboard",
    icon: RiDashboard3Fill,
    href: "/dashboard",
  },
  {
    label: "Orders",
    icon: ShoppingCartIcon,
    href: "/dashboard/orders",
  },
  {
    label: "Products",
    icon: ShoppingBagIcon,
    href: "/dashboard/products",
  },
  {
    label: "Analytics",
    icon: TagIcon,
    href: "/dashboard/plau",
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
    href: "/dashboard/Store",
  },
] as const;

export default function DashboardSideBar() {
  const pathname = usePathname();

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
                    {/*  <route.icon className="text-lg" /> */}
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
