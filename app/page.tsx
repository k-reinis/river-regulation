
//@ts-nocheck
"use client";


import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});

export default function HomePage() {
  return (
    <main>
      
      <DynamicMap />
    </main>
  );
}
