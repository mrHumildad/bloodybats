import React from "react";

const Field = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0b0f1a]">
      <svg viewBox="0 0 100 100" className="w-full max-w-md h-auto">

        {/* Outfield grass (TRUE wedge from home plate) */}
        <path
          d="M50 70 L10 30 A45 45 0 0 1 90 30 Z"
          fill="#2e7d32"
        />

        {/* Infield dirt (diamond) */}
        <path
          d="M50 30 L70 50 L50 70 L30 50 Z"
          fill="#c68642"
        />

        {/* Bases */}
        <rect x="48" y="28" width="4" height="4" fill="#ddd" /> {/* 2nd */}
        <rect x="68" y="48" width="4" height="4" fill="#ddd" /> {/* 1st */}
        <rect x="48" y="68" width="4" height="4" fill="#ddd" /> {/* home */}
        <rect x="28" y="48" width="4" height="4" fill="#ddd" /> {/* 3rd */}

        {/* Pitcher's mound */}
        <circle cx="50" cy="50" r="3" fill="#a0522d" />

        {/* Foul lines */}
        <line x1="50" y1="70" x2="10" y2="30" stroke="#ffffff" strokeWidth="0.7" />
        <line x1="50" y1="70" x2="90" y2="30" stroke="#ffffff" strokeWidth="0.7" />

        {/* Outfield fence (home run boundary aligned with grass) */}
        <path
          d="M10 30 A45 45 0 0 1 90 30"
          fill="none"
          stroke="#ffffff"
          strokeWidth="1"
          strokeDasharray="3 3"
        />

      </svg>
    </div>
  );
};

export default Field;
