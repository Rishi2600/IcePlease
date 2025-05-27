"use client";

import { ShoppingCart, User, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const session = useSession();

  console.log(session);

  return (
    <nav className="bg-amber-50 border-b border-gray-200 px-4 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo/Brand Name */}
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Ice<span className="text-blue-300">Please</span>
          </h1>
        </div>

        {/* Right side - Cart and Auth */}
        <div className="flex items-center space-x-4">
          {/* Cart Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:cursor-pointer"
          >
            <ShoppingCart className="h-5 w-5" />
            {/* Cart badge - you can make this dynamic */}
            <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </Button>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 hover:cursor-pointer"
          >
            <Moon className="h-5 w-5" />
          </Button>

          {/* Authentication Button */}
          {session.status === "authenticated" && (
            <Button
              onClick={() => {
                signIn();
              }}
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
            >
              <User className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}

          {session.status === "unauthenticated" && (
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="text-gray-700 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:cursor-pointer"
            >
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
