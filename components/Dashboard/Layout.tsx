
"use client";
import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

const Layout = ({ children }: { children: ReactNode }) => {


  return (
    // Main dashboard wrapper
    // sidebar on left content on right
    <div className="flex flex-col md:flex-row min-h-screen md:h-screen lg:h-screen bg-white">
    <Sidebar />
    <div className="flex-1 flex flex-col min-w-0 pl-0 lg:pl-0">
      <Header />
      <main className="pt-4 pb-20 md:pb-4 overflow-auto flex-1 min-h-0">
        {children}
      </main>
    </div>
  </div>
  
  );
};

export default Layout;
