"use client";

import Link from "next/link";
import React from "react";
import Image from "next/image";
import classnames from "classnames";

import logo from "@/images/tsa-logo.png";
import { usePathname } from "next/navigation";

import {
  LogOut,
  Lock,
  Settings,
  User,
  UserPlus,
  Search,
  Menu,
  Package2,
} from "lucide-react";

import { signOut } from "@/lib/server_actions/auth.actions";

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
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function UserMenu({ ...props }) {
  const isAdmin = props.role === "admin" ? true : false;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{props.userName}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <Link href="/admin/my_account">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <Link href="/admin/my_account">Settings</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Admin</DropdownMenuLabel>
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserPlus className="mr-2 h-4 w-4" />
                <Link href="/admin/user_permissions">Create New User</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Lock className="mr-2 h-4 w-4" />
                <Link href="/admin/user_permissions">
                  Edit User Permissions
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          <form action={signOut}>
            <button type="submit">Sign out</button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const NavBar = ({ ...props }) => {
  const currentPath = usePathname();
  const links = [
    // { label: "Dashboard", href: "/admin" },
    { label: "Schools", href: "/admin/schools" },
    { label: "Programs", href: "/admin/programs" },
    { label: "Grades", href: "/admin/grades" },
    { label: "Instruments", href: "/admin/instruments" },
    { label: "Accessories", href: "/admin/accessories" },
  ];

  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 py-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/admin">
          <Image src={logo} alt="TSA Logo" className="max-w-14"></Image>
        </Link>
        {links.map((link) => (
          <Link
            className={classnames({
              "text-foreground": currentPath.startsWith(link.href),
              "text-muted-foreground": !currentPath.startsWith(link.href),
              "hover:text-foreground transition-colors": true,
            })}
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link href="/admin">
              <Image
                src={logo}
                alt="TSA Logo"
                className="max-w-14 py-2"
              ></Image>
            </Link>
            {links.map((link) => (
              <Link
                className={classnames({
                  "text-foreground": link.href === currentPath,
                  "text-muted-foreground": link.href !== currentPath,
                  "hover:text-foreground transition-colors": true,
                })}
                key={link.href}
                href={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <form className="ml-auto flex-1 sm:flex-initial">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </div>
        </form>
        <UserMenu userName={props.userName} role={props.role} />
      </div>
    </header>
  );
};

export default NavBar;
