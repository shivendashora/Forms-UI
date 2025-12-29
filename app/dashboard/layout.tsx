"use client";

import AuthGuard from "../components/authguard"

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AuthGuard>
      {children}
    </AuthGuard>
  );
}
