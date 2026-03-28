'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CrossMediaLiftCardProps {
  radioOnly: number;
  socialOnly: number;
  combined: number;
  liftPercentage: number;
}

export const CrossMediaLiftCard: React.FC<CrossMediaLiftCardProps> = ({
  radioOnly,
  socialOnly,
  combined,
  liftPercentage,
}) => {
  const maxValue = Math.max(radioOnly, socialOnly, combined);
  const normalizedRadio = (radioOnly / maxValue) * 100;
  const normalizedSocial = (socialOnly / maxValue) * 100;
  const normalizedCombined = (combined / maxValue) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-xl border border-gray-700 bg-[#0F1528] p-6"
    >
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <h3 className="text-gray-300 text-sm font-medium mb-2">Cross-Media Lift</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-green-400">
            +{liftPercentage}%
          </span>
          <span className="text-gray-400 text-lg">performance increase</span>
        </div>
      </motion.div>

      {/* Comparison bars */}
      <div className="space-y-5">
        {/* Radio Only */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-300 font-medium">{radioOnly.toLocaleString()}</label>
            <span className="text-gray-400 text-xs">Radio Only</span>
          </div>
          <motion.div
            className="h-3 bg-gray-700 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.35 }}
          >
            <motion.div
              className="h-full bg-gray-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${normalizedRadio}%` }}
              transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Social Only */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-300 font-medium">{socialOnly.toLocaleString()}</label>
            <span className="text-gray-400 text-xs">Social Only</span>
          </div>
          <motion.div
            className="h-3 bg-gray-700 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.45 }}
          >
            <motion.div
              className="h-full bg-gray-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${normalizedSocial}%` }}
              transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>

        {/* Both (Combined) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-300 font-medium">{combined.toLocaleString()}</label>
            <span className="text-gray-400 text-xs font-semibold">Both (Radio + Social)</span>
          </div>
          <motion.div
            className="h-3 bg-gray-700 rounded-full overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.55 }}
          >
            <motion.div
              className="h-full bg-green-400 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${normalizedCombined}%` }}
              transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};
