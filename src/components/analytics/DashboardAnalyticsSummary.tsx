'use client';

import React, { useMemo } from 'react';
import { Globe, Zap, Activity, Trophy } from 'lucide-react';
import { AnalyticsSummaryCard } from './AnalyticsSummaryCard';
import { getRadioGroupAnalytics } from '@/lib/analytics-data';

interface DashboardAnalyticsSummaryProps {
  clientId: string;
}

export function DashboardAnalyticsSummary({ clientId }: DashboardAnalyticsSummaryProps) {
  const analytics = useMemo(() => getRadioGroupAnalytics(clientId), [clientId]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <AnalyticsSummaryCard
        icon={Globe}
        label="Network Reach"
        value={analytics.networkReach}
        previousValue={Math.round(analytics.networkReach * 0.88)}
        sparklineData={[
          analytics.networkReach * 0.6,
          analytics.networkReach * 0.68,
          analytics.networkReach * 0.72,
          analytics.networkReach * 0.8,
          analytics.networkReach * 0.88,
          analytics.networkReach * 0.94,
          analytics.networkReach,
        ]}
      />
      <AnalyticsSummaryCard
        icon={Zap}
        label="Active Moment-Ads"
        value={analytics.activeMomentAds}
        previousValue={Math.round(analytics.activeMomentAds * 0.85)}
        sparklineData={[
          analytics.activeMomentAds * 0.5,
          analytics.activeMomentAds * 0.6,
          analytics.activeMomentAds * 0.7,
          analytics.activeMomentAds * 0.75,
          analytics.activeMomentAds * 0.85,
          analytics.activeMomentAds * 0.92,
          analytics.activeMomentAds,
        ]}
      />
      <AnalyticsSummaryCard
        icon={Activity}
        label="Avg POP Score"
        value={analytics.avgPopScore}
        previousValue={analytics.avgPopScore - 5}
        format="number"
        sparklineData={[
          analytics.avgPopScore - 12,
          analytics.avgPopScore - 8,
          analytics.avgPopScore - 6,
          analytics.avgPopScore - 4,
          analytics.avgPopScore - 2,
          analytics.avgPopScore - 1,
          analytics.avgPopScore,
        ]}
      />
      <AnalyticsSummaryCard
        icon={Trophy}
        label="Top Station"
        value={1}
        format="number"
        sparklineData={[1, 1, 1, 1, 1, 1, 1]}
      />
    </div>
  );
}
