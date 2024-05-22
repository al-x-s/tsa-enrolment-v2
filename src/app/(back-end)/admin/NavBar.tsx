"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import classnames from "classnames";

import logo from "@/images/tsa-logo.png";
import { usePathname } from "next/navigation";

import { LogOut, Lock, Settings, User, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function UserMenu({ ...props }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          {props.userName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Admin</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <UserPlus className="mr-2 h-4 w-4" />
            <span>Create New User</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Lock className="mr-2 h-4 w-4" />
            <span>Edit User Permissions</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <Link href="/api/auth/signout?callbackUrl=/welcome">Logout</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const NavBar = ({ ...props }) => {
  const currentPath = usePathname();
  const links = [
    { label: "Dashboard", href: "/admin" },
    { label: "Schools", href: "/admin/schools" },
  ];

  return (
    <nav className="flex gap-6 border-b mb-5 px-5 py-5 items-center">
      <Link href="/admin">
        <Image src={logo} alt="TSA Logo" className="max-w-20"></Image>
      </Link>
      <ul className="flex gap-6">
        {links.map((link) => (
          <Link
            className={classnames({
              "text-zinc-900": link.href === currentPath,
              "text-zinc-500": link.href !== currentPath,
              "hover:text-zinc-800 transition-colors": true,
            })}
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </ul>
      <UserMenu userName={props.userName} />
    </nav>
  );
};

export default NavBar;
