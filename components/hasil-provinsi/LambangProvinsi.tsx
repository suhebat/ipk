"use client";

import { useState } from "react";

export default function LambangProvinsi({
  kodeBps,
  name,
}: {
  kodeBps: string;
  name: string;
}) {
  const [err, setErr] = useState(false);
  const src = `/images/lambang/${kodeBps}.png`;

  if (err) {
    const initials = name
      .replace(/^(Provinsi|DI|DKI)\s+/i, "")
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0] || "")
      .join("")
      .toUpperCase();
    return (
      <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-gradient-to-b from-[#F8DA8D] to-[#B8860B] flex items-center justify-center text-white font-bold text-lg shadow-inner">
        {initials || "ID"}
      </div>
    );
  }

  return (
    <div className="relative w-20 h-24 sm:w-24 sm:h-28 shrink-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={`Lambang ${name}`}
        className="w-full h-full object-contain drop-shadow-md"
        onError={() => setErr(true)}
      />
    </div>
  );
}