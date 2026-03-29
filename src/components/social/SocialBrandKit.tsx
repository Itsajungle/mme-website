"use client";

import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, ImageIcon, Type, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Brand } from "@/lib/demo-data";
import type { SocialBrandKit as SocialBrandKitType, BrandAsset } from "@/lib/social-engine/brand-kit-types";

interface SocialBrandKitProps {
  kit: SocialBrandKitType;
  onUpdate: (kit: SocialBrandKitType) => void;
  brand: Brand;
}

const FONT_OPTIONS = [
  "Montserrat",
  "Open Sans",
  "Poppins",
  "Inter",
  "Playfair Display",
  "Roboto",
  "Lato",
  "Raleway",
  "Oswald",
  "Nunito",
];

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml"];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const RIORDAN_DEFAULTS: Partial<SocialBrandKitType> = {
  primaryColor: "#1E3A5F",
  secondaryColor: "#F5F5F5",
  accentColor: "#E63946",
  backgroundColor: "#FFFFFF",
  headlineFont: "Montserrat",
  bodyFont: "Open Sans",
  toneOfVoice: "Friendly, trustworthy, family-focused",
  tagline: "Tell them Tadg sent you",
};

// ── Colour Picker Circle ─────────────────────────────────────────────────
function ColorCircle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (hex: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={() => inputRef.current?.click()}
        className="w-14 h-14 rounded-full border-2 border-border hover:border-accent/40 transition-colors cursor-pointer relative overflow-hidden"
        style={{ backgroundColor: value }}
      >
        <input
          ref={inputRef}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
      </button>
      <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
        {label}
      </span>
      <span className="text-xs text-text-secondary font-mono">{value}</span>
    </div>
  );
}

// ── Upload Zone ──────────────────────────────────────────────────────────
function UploadZone({
  label,
  icon: Icon,
  assets,
  onUpload,
  onRemove,
}: {
  label: string;
  icon: typeof ImageIcon;
  assets: BrandAsset[];
  onUpload: (files: FileList) => void;
  onRemove: (id: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) {
        onUpload(e.dataTransfer.files);
      }
    },
    [onUpload]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon size={14} className="text-accent" />
        <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
          {label}
        </span>
        <span className="text-[10px] text-text-muted font-mono">
          ({assets.length})
        </span>
      </div>

      {/* Drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => inputRef.current?.click()}
        className="flex flex-col items-center justify-center gap-2 py-6 rounded-xl border-2 border-dashed border-border hover:border-accent/30 bg-bg-deep cursor-pointer transition-colors"
      >
        <Upload size={20} className="text-text-muted" />
        <p className="text-xs text-text-muted">
          Drop files here or click to upload
        </p>
        <p className="text-[10px] text-text-muted/60 font-mono">
          PNG, JPG, WEBP, SVG · Max 10MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              onUpload(e.target.files);
              e.target.value = "";
            }
          }}
          className="hidden"
        />
      </div>

      {/* Asset grid */}
      {assets.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          <AnimatePresence>
            {assets.map((asset) => (
              <motion.div
                key={asset.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-lg border border-border bg-bg-deep overflow-hidden"
              >
                <div className="aspect-square">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <p className="text-[10px] text-text-secondary truncate">
                    {asset.name}
                  </p>
                  {asset.width && asset.height && (
                    <p className="text-[9px] text-text-muted font-mono">
                      {asset.width}×{asset.height}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(asset.id);
                  }}
                  className="absolute top-1.5 right-1.5 p-1.5 rounded-md bg-bg-card/80 backdrop-blur-sm border border-border opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-500/40 hover:text-red-400"
                >
                  <Trash2 size={12} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────────────
export function SocialBrandKit({ kit, onUpdate, brand }: SocialBrandKitProps) {
  // Auto-populate for Riordan Motors
  useEffect(() => {
    if (brand.slug === "riordan-motors" && kit.brandSlug !== "riordan-motors") {
      onUpdate({
        ...kit,
        brandSlug: "riordan-motors",
        ...RIORDAN_DEFAULTS,
      } as SocialBrandKitType);
    } else if (kit.brandSlug !== brand.slug) {
      onUpdate({ ...kit, brandSlug: brand.slug });
    }
  }, [brand.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateColor = (field: keyof SocialBrandKitType, value: string) => {
    onUpdate({ ...kit, [field]: value });
  };

  const processFiles = useCallback(
    (
      files: FileList,
      assetType: "logo" | "product" | "hero",
      field: "logos" | "productImages" | "heroImages"
    ) => {
      const newAssets: BrandAsset[] = [];

      Array.from(files).forEach((file) => {
        if (!ACCEPTED_TYPES.includes(file.type)) return;
        if (file.size > MAX_FILE_SIZE) return;

        const url = URL.createObjectURL(file);
        const asset: BrandAsset = {
          id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          type: assetType,
          url,
          fileSize: file.size,
          uploadedAt: new Date().toISOString(),
        };

        // Read dimensions
        const img = new Image();
        img.onload = () => {
          asset.width = img.naturalWidth;
          asset.height = img.naturalHeight;
          // Force re-render with dimensions
          onUpdate({ ...kit, [field]: [...kit[field], ...newAssets] });
        };
        img.src = url;

        newAssets.push(asset);
      });

      if (newAssets.length > 0) {
        onUpdate({ ...kit, [field]: [...kit[field], ...newAssets] });
      }
    },
    [kit, onUpdate]
  );

  const removeAsset = (field: "logos" | "productImages" | "heroImages", id: string) => {
    const asset = kit[field].find((a) => a.id === id);
    if (asset) URL.revokeObjectURL(asset.url);
    onUpdate({ ...kit, [field]: kit[field].filter((a) => a.id !== id) });
  };

  return (
    <div className="p-6 space-y-8">
      {/* ── Brand Colours ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Droplets size={14} className="text-accent" />
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
            Brand Colours
          </span>
        </div>
        <div className="flex flex-wrap gap-6 justify-center sm:justify-start py-4 px-2 rounded-xl border border-border bg-bg-deep">
          <ColorCircle
            label="Primary"
            value={kit.primaryColor}
            onChange={(v) => updateColor("primaryColor", v)}
          />
          <ColorCircle
            label="Secondary"
            value={kit.secondaryColor}
            onChange={(v) => updateColor("secondaryColor", v)}
          />
          <ColorCircle
            label="Accent"
            value={kit.accentColor}
            onChange={(v) => updateColor("accentColor", v)}
          />
          <ColorCircle
            label="Background"
            value={kit.backgroundColor}
            onChange={(v) => updateColor("backgroundColor", v)}
          />
        </div>
      </motion.div>

      {/* ── Typography ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
        className="space-y-4"
      >
        <div className="flex items-center gap-2">
          <Type size={14} className="text-accent" />
          <span className="text-[10px] uppercase tracking-wider text-text-muted font-mono">
            Typography
          </span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
              Headline Font
            </label>
            <select
              value={kit.headlineFont}
              onChange={(e) => onUpdate({ ...kit, headlineFont: e.target.value })}
              className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
              Body Font
            </label>
            <select
              value={kit.bodyFont}
              onChange={(e) => onUpdate({ ...kit, bodyFont: e.target.value })}
              className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors appearance-none cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>
          </div>
        </div>
      </motion.div>

      {/* ── Brand Assets ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="space-y-6"
      >
        <UploadZone
          label="Logos"
          icon={ImageIcon}
          assets={kit.logos}
          onUpload={(files) => processFiles(files, "logo", "logos")}
          onRemove={(id) => removeAsset("logos", id)}
        />

        <UploadZone
          label="Product Images"
          icon={ImageIcon}
          assets={kit.productImages}
          onUpload={(files) => processFiles(files, "product", "productImages")}
          onRemove={(id) => removeAsset("productImages", id)}
        />

        <UploadZone
          label="Hero Images"
          icon={ImageIcon}
          assets={kit.heroImages}
          onUpload={(files) => processFiles(files, "hero", "heroImages")}
          onRemove={(id) => removeAsset("heroImages", id)}
        />
      </motion.div>

      {/* ── Brand Voice ── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className="space-y-4"
      >
        <div>
          <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
            Tone of Voice
          </label>
          <input
            type="text"
            value={kit.toneOfVoice}
            onChange={(e) => onUpdate({ ...kit, toneOfVoice: e.target.value })}
            placeholder="e.g. Friendly and approachable"
            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
        <div>
          <label className="text-[10px] uppercase tracking-wider text-text-muted font-mono mb-1.5 block">
            Tagline
          </label>
          <input
            type="text"
            value={kit.tagline}
            onChange={(e) => onUpdate({ ...kit, tagline: e.target.value })}
            placeholder="e.g. Your brand's signature line"
            className="w-full bg-bg-deep border border-border rounded-lg px-3 py-2 text-sm text-text placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
          />
        </div>
      </motion.div>
    </div>
  );
}
