"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CHANNEL = "cupangpandi-uploads-change";

export function notifyUploadsChanged(): void {
  try {
    if (typeof BroadcastChannel !== "undefined") {
      const channel = new BroadcastChannel(CHANNEL);
      channel.postMessage({ at: Date.now() });
      channel.close();
    }
  } catch {
    // ignore — live refresh is a nice-to-have
  }
}

export default function LiveRefresh() {
  const router = useRouter();

  useEffect(() => {
    if (typeof BroadcastChannel === "undefined") {
      return;
    }
    const channel = new BroadcastChannel(CHANNEL);
    channel.onmessage = () => {
      router.refresh();
    };
    return () => channel.close();
  }, [router]);

  return null;
}