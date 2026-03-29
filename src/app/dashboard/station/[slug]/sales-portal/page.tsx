"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { getStationBySlug } from "@/lib/clients";
import { SalesDemoBoard } from "@/components/sales-portal/SalesDemoBoard";

export default function SalesPortalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { client } = useAuth();
  const router = useRouter();

  if (!client) return null;

  const station = getStationBySlug(client.id, slug);

  if (!station) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-text-secondary mb-4">Station not found</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="text-accent hover:text-accent-hover text-sm"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={() => router.push(`/dashboard/station/${slug}`)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to {station.name}
      </button>
      <SalesDemoBoard stationId={slug} stationName={station.name} />
    </motion.div>
  );
}
