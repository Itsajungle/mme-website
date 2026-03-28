"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import { HERO } from "@/lib/constants";

function MomentPulse() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; size: number }[] = [];
    const pulses: { x: number; y: number; radius: number; maxRadius: number; opacity: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    const w = () => canvas.offsetWidth;
    const h = () => canvas.offsetHeight;

    let frame = 0;
    const animate = () => {
      ctx.clearRect(0, 0, w(), h());
      frame++;

      // Spawn particles
      if (frame % 3 === 0 && particles.length < 80) {
        particles.push({
          x: Math.random() * w(),
          y: Math.random() * h(),
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          life: 0,
          maxLife: 120 + Math.random() * 120,
          size: 1 + Math.random() * 2,
        });
      }

      // Spawn pulses
      if (frame % 90 === 0) {
        pulses.push({
          x: w() * (0.3 + Math.random() * 0.4),
          y: h() * (0.3 + Math.random() * 0.4),
          radius: 0,
          maxRadius: 80 + Math.random() * 60,
          opacity: 0.4,
        });
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            const alpha = (1 - dist / 100) * 0.15;
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;
        const lifeRatio = p.life / p.maxLife;
        const alpha = lifeRatio < 0.1 ? lifeRatio * 10 : lifeRatio > 0.9 ? (1 - lifeRatio) * 10 : 1;
        ctx.fillStyle = `rgba(245, 158, 11, ${alpha * 0.6})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        if (p.life >= p.maxLife) particles.splice(i, 1);
      }

      // Update & draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const pulse = pulses[i];
        pulse.radius += 1;
        pulse.opacity *= 0.985;
        ctx.strokeStyle = `rgba(245, 158, 11, ${pulse.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();
        if (pulse.opacity < 0.01) pulses.splice(i, 1);
      }

      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

export function Hero() {
  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden pt-16">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(245, 158, 11, 0.06) 0%, transparent 60%)",
        }}
      />

      {/* Particle canvas */}
      <MomentPulse />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-border bg-bg-card/50 text-xs font-mono text-accent">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
            </span>
            MOMENT DETECTED
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text max-w-5xl mx-auto leading-[1.1]"
        >
          {HERO.headline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl text-text-secondary max-w-2xl mx-auto"
        >
          {HERO.subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="#how-it-works"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius)] border border-border text-text hover:bg-bg-card transition-colors"
          >
            <Play size={16} />
            {HERO.cta1}
          </Link>
          <Link
            href="/demo"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium rounded-[var(--radius)] bg-accent text-bg hover:bg-accent-hover transition-colors"
          >
            {HERO.cta2}
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* POP Factor tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-16 text-sm text-text-muted font-mono"
        >
          POP for the social media age — your content, matched to the moment, published while it matters.
        </motion.p>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
    </section>
  );
}
