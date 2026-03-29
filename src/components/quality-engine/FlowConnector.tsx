"use client";

import { motion } from "framer-motion";

interface FlowConnectorProps {
  fromColor: string;
  toColor: string;
  direction?: "horizontal" | "vertical";
}

export function FlowConnector({ fromColor, toColor, direction = "horizontal" }: FlowConnectorProps) {
  const isHorizontal = direction === "horizontal";

  if (isHorizontal) {
    return (
      <div className="flex items-center justify-center w-12 lg:w-16 shrink-0">
        <svg width="100%" height="40" viewBox="0 0 64 40" fill="none" className="overflow-visible">
          <defs>
            <linearGradient id={`grad-${fromColor}-${toColor}`} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={fromColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={toColor} stopOpacity="0.4" />
            </linearGradient>
          </defs>
          {/* Line */}
          <line
            x1="0" y1="20" x2="64" y2="20"
            stroke={`url(#grad-${fromColor}-${toColor})`}
            strokeWidth="2"
          />
          {/* Arrow head */}
          <path
            d="M56 14 L64 20 L56 26"
            stroke={toColor}
            strokeOpacity="0.5"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Flowing dot */}
          <motion.circle
            cx="0"
            cy="20"
            r="3"
            fill="white"
            opacity="0.9"
            filter="drop-shadow(0 0 4px white)"
            animate={{ cx: [0, 64] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
          />
          <motion.circle
            cx="0"
            cy="20"
            r="3"
            fill="white"
            opacity="0.5"
            filter="drop-shadow(0 0 4px white)"
            animate={{ cx: [0, 64] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5, delay: 1.1 }}
          />
        </svg>
      </div>
    );
  }

  // Vertical connector for mobile
  return (
    <div className="flex justify-center h-10 shrink-0">
      <svg width="40" height="100%" viewBox="0 0 40 40" fill="none" className="overflow-visible">
        <defs>
          <linearGradient id={`vgrad-${fromColor}-${toColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <line
          x1="20" y1="0" x2="20" y2="40"
          stroke={`url(#vgrad-${fromColor}-${toColor})`}
          strokeWidth="2"
        />
        <path
          d="M14 32 L20 40 L26 32"
          stroke={toColor}
          strokeOpacity="0.5"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <motion.circle
          cx="20"
          cy="0"
          r="3"
          fill="white"
          opacity="0.9"
          filter="drop-shadow(0 0 4px white)"
          animate={{ cy: [0, 40] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.5 }}
        />
      </svg>
    </div>
  );
}
