"use client";


import dynamic from "next/dynamic";
import { useEffect } from "react";

const DynamicMap = dynamic(() => import("../components/Map"), {
  ssr: false,
  loading: () => <p>Loading map...</p>,
});




export default function HomePage() {
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
  
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);
  return (
    <main>
      
      <DynamicMap />
    </main>
  );
}
