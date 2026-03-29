"use client";

import { motion } from "framer-motion";

interface FlowConnectorProps {
  fromColor: string;
  toColor: string;
  direction?: "horizontal" | "vertical";
}

export function FlowConnector({
  fromColor,
  toColor,
  direction = "horizontal",
}: FlowConnectorProps) {
  const gradId = `grad-${fromColor.replace("#", "")}-${toColor.replace("#", "")}`;
  const isHorizontal = direction === "horizontal";

  if (isHorizontal) {
    return (
      <div className="flex items-center justify-center w-10 lg:w-14 shrink-0">
        <svg
          width="100%"
          height="40"
          viewBox="0 0 56 40"
          fill="none"
          className="overflow-visible"
        >
          <defs>
            <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={fromColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={toColor} stopOpacity="0.5" />
            </linearGradient>
          </defs>
          <line
            x1="0"
            y1="20"
            x2="56"
            y2="20"
            stroke={`url(#${gradId})`}
            strokeWidth="2"
          />
          <path
            d="M48 14 L56 20 L48 26"
            stroke={toColor}
            strokeOpacity="0.6"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Flowing dot 1 */}
          <motion.circle
            cx="0"
            cy="20"
            r="3"
            fill="white"
            opacity="0.9"
            filter="drop-shadow(0 0 4px white)"
            animate={{ cx: [0, 56] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.4,
            }}
          />
          {/* Flowing dot 2 */}
          <motion.circle
            cx="0"
            cy="20"
            r="2.5"
            fill="white"
            opacity="0.5"
            filter="drop-shadow(0 0 3px white)"
            animate={{ cx: [0, 56] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeInOut",
              repeatDelay: 0.4,
              delay: 0.9,
            }}
          />
        </svg>
      </div>
    );
  }

  // Vertical connector for mobile
  const vGradId = `v${gradId}`;
  return (
    <div className="flex justify-center h-8 shrink-0">
      <svg
        width="40"
        height="100%"
        viewBox="0 0 40 32"
        fill="none"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={vGradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={fromColor} stopOpacity="0.5" />
            <stop offset="100%" stopColor={toColor} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <line
          x1="20"
          y1="0"
          x2="20"
          y2="32"
          stroke={`url(#${vGradId})`}
          strokeWidth="2"
        />
        <path
          d="M14 24 L20 32 L26 24"
          stroke={toColor}
          strokeOpacity="0.6"
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
          animate={{ cy: [0, 32] }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 0.4,
          }}
        />
      </svg>
    </div>
  );
}
