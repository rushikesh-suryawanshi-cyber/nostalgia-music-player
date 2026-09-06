"use client";

import dynamic from "next/dynamic";

const NostalgiaApp = dynamic(
  () => import("@/components/NostalgiaApp").then((mod) => mod.NostalgiaApp),
  {
    ssr: false,
    loading: () => (
      <div className="w-screen h-screen bg-[#070709] flex items-center justify-center text-white/50 font-mono text-xs tracking-widest uppercase">
        Loading Nostalgia...
      </div>
    ),
  }
);

export default function Home() {
  return (
    <main className="w-screen h-screen h-[100dvh] overflow-hidden bg-[#070709]">
      <NostalgiaApp />
    </main>
  );
}
