"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Upload, Search, FileText, Settings, LogOut } from "lucide-react";

export default function AppSidebar() {
  return (
    <div className="w-72 bg-white border-r h-screen p-6 flex flex-col fixed">
      {/* Logo */}
      <div className="mb-12">
        <h1 className="text-2xl font-bold text-blue-600">DocRetrieve AI</h1>
        <p className="text-xs text-gray-500 mt-1">Enterprise Knowledge Engine</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
            <Home size={20} />
            Dashboard
          </Button>
        </Link>

        <Link href="/upload">
          <Button variant="default" className="w-full justify-start gap-3 h-12 text-left">
            <Upload size={20} />
            Upload Documents
          </Button>
        </Link>

        <Link href="/search">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
            <Search size={20} />
            Intelligent Search
          </Button>
        </Link>

        <Link href="/documents">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
            <FileText size={20} />
            My Documents
          </Button>
        </Link>

        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start gap-3 h-12 text-left">
            <Settings size={20} />
            Settings
          </Button>
        </Link>
      </nav>

      {/* User Section */}
      <div className="pt-8 border-t mt-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
            A
          </div>
          <div>
            <p className="font-medium">Avinash</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
        
        <Button variant="ghost" className="w-full justify-start gap-3 text-red-600">
          <LogOut size={20} />
          Logout
        </Button>
      </div>
    </div>
  );
}