"use client";
import { useState } from "react";

type Props = {
  text: string;
  translation?: string;
};

export default function TranslatableWord({ text, translation }: Props) {
  const [show, setShow] = useState(false);

  if (!translation) {
    return <>{text}</>;
  }

  return (
    <span
      className="relative inline cursor-help border-b border-dotted border-emerald-400"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={(e) => {
        e.stopPropagation();
        setShow((s) => !s);
      }}
    >
      {text}
      {show && (
        <span
          dir="rtl"
          className="absolute bottom-full left-1/2 z-20 mb-1 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white shadow-lg"
        >
          {translation}
        </span>
      )}
    </span>
  );
}