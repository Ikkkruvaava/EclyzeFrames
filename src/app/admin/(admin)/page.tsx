import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Dashboard | ECLYZE Frames",
  description: "Dashboard for photo framing application.",
};

export default async function Dashboard() {
  const adminName = "Admin";

  return (
    <div className="p-6 space-y-6 flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Welcome to the Photo Framing Dashboard, <span className="text-blue-600 dark:text-yellow-400">{adminName}</span> 👋
        </h2>
        <p className="mt-4 text-gray-500 dark:text-gray-300">
          Manage your photo frames and view progress from the sidebar.
        </p>
      </div>
    </div>
  );
}
