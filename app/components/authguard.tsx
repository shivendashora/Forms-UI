"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function isTokenExpired(token: string): boolean {
  if (!token) return true;

  try {
    const payloadBase64 = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payloadBase64));

    const now = Math.floor(Date.now() / 1000);
    return decodedPayload.exp < now;
  } catch (err) {
    console.error("Error decoding JWT:", err);
    return true;
  }
}

export default function AuthGuard({ children }: Readonly<{ children: React.ReactNode }>) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("UserCredentials");

    if (!stored) {
      router.replace("/login");
      return;
    }

    const { accessToken } = JSON.parse(stored);

    console.log("isToken expired", isTokenExpired(accessToken))

    if (!accessToken || isTokenExpired(accessToken)) {
      router.replace("/login");
      return;
    }


    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
