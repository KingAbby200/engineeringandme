'use client';
import { useEffect } from 'react';

export default function AdsterraNative() {
  useEffect(() => {
    // Only run on the client side
    if (typeof window === 'undefined') return;

    // Check if the script is already loaded to prevent duplicate injections
    const scriptId = 'adsterra-native-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.setAttribute('data-cfasync', 'false');
      script.src = 'https://pl29530695.effectivecpmnetwork.com/479aaa137c71f951aa5d7e80a7573754/invoke.js';
      
      document.body.appendChild(script);
    }
  }, []);

  return (
    <div className="flex justify-center my-6 min-h-[250px] w-full">
      {/* This ID matches your Adsterra code precisely */}
      <div id="container-479aaa137c71f951aa5d7e80a7573754" />
    </div>
  );
}