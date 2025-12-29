"use client";

import { useLoaderStore } from "../store/loaderStore";

export default function Loader() {
  const loading = useLoaderStore((state) => state.loading);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-14 h-14 rounded-full border-[6px] border-white border-t-transparent animate-spin" />
    </div>
  );
}
