"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const Links = [
    { name: "Home", href: "/" },

    { name: "Services", href: "/services" },
  ];

  return (
    <nav className="flex gap-6">
      {Links.map((link, index) => {
        return (
          <Link
            href={link.href}
            key={index}
            className={`${
              link.href === pathname && "text-black border-b-2 border-black"
            } capitalize font-medium hover:text-black transition-all ease-in-out`}
          >
            {link.name}
          </Link>
        );
      })}
    </nav>
  );
}
