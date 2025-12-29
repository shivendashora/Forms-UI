"use client";

import Loader from "./loader";

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Loader />
      {children}
    </>
  );
}
