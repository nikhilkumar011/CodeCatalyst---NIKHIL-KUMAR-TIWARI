"use client"; // This tells Next.js this specific part runs in the browser

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorRedirect() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/root");
    }, 3500); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#05070d] text-[#F2F4F8]">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-[10px] bg-red-500/10 text-lg text-red-400">
          ⚠️
        </div>
        <p className="text-[14.5px] font-medium text-[#D7DAE2]">API Unavailable</p>
        <p className="mt-1 text-[13px] text-[#6B7180]">
          We couldn&apos;t retrieve the data. Redirecting you back...
        </p>
      </div>
    </div>
  );
}