"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Trash2, ImageIcon, Type, Droplets, Save, Loader2, CheckCircle2 } from "lucide-react";
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
  uploading,
}: {
  label: string;
  icon: typeof ImageIcon;
  assets: BrandAsset[];
  onUpload: (files: FileList) => void;
  onRemove: (id: string) => void;
  uploading?: boolean;
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
        {uploading && <Loader2 size={12} className="animate-spin text-accent" />}
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
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);

  const brandId = brand.slug;
  const stationId = brand.stationSlug;

  // ── Load saved brand kit on mount ──
  useEffect(() => {
    if (loadedOnce) return;
    let cancelled = false;

    async function loadKit() {
      try {
        const res = await fetch(
          `/api/social/brand-kit?brand_id=${encodeURIComponent(brandId)}&station_id=${encodeURIComponent(stationId)}`
        );
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !data.brand_kit) return;

        const saved = data.brand_kit;
        onUpdate({
          ...kit,
          brandSlug: brandId,
          primaryColor: saved.primary_color || kit.primaryColor,
          secondaryColor: saved.secondary_color || kit.secondaryColor,
          accentColor: saved.accent_color || kit.accentColor,
          backgroundColor: saved.background_color || kit.backgroundColor,
          headlineFont: saved.headline_font || kit.headlineFont,
          bodyFont: saved.body_font || kit.bodyFont,
          toneOfVoice: saved.tone_of_voice || kit.toneOfVoice,
          tagline: saved.tagline || kit.tagline,
          logos: Array.isArray(saved.logos) ? saved.logos : kit.logos,
          productImages: Array.isArray(saved.product_images) ? saved.product_images : kit.productImages,
          heroImages: Array.isArray(saved.hero_images) ? saved.hero_images : kit.heroImages,
        });
      } catch {
        // silently fall back to defaults / Riordan defaults
      } finally {
        if (!cancelled) setLoadedOnce(true);
      }
    }

    loadKit();
    return () => { cancelled = true; };
  }, [brandId, stationId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-populate for Riordan Motors only if nothing was loaded from DB
  useEffect(() => {
    if (!loadedOnce) return;
    if (brand.slug === "riordan-motors" && kit.brandSlug !== "riordan-motors") {
      onUpdate({
        ...kit,
        brandSlug: "riordan-motors",
        ...RIORDAN_DEFAULTS,
      } as SocialBrandKitType);
    } else if (kit.brandSlug !== brand.slug) {
      onUpdate({ ...kit, brandSlug: brand.slug });
    }
  }, [brand.slug, loadedOnce]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Save brand kit ──
  const handleSave = async () => {
    setSaveStatus("saving");
    try {
      const payload = {
        brand_id: brandId,
        station_id: stationId,
        primary_color: kit.primaryColor,
        secondary_color: kit.secondaryColor,
        accent_color: kit.accentColor,
        background_color: kit.backgroundColor,
        headline_font: kit.headlineFont,
        body_font: kit.bodyFont,
        tone_of_voice: kit.toneOfVoice,
        tagline: kit.tagline,
        logos: kit.logos.map((a) => ({ id: a.id, url: a.url, name: a.name, type: a.type, width: a.width, height: a.height })),
        product_images: kit.productImages.map((a) => ({ id: a.id, url: a.url, name: a.name, type: a.type, width: a.width, height: a.height })),
        hero_images: kit.heroImages.map((a) => ({ id: a.id, url: a.url, name: a.name, type: a.type, width: a.width, height: a.height })),
      };

      const res = await fetch("/api/social/brand-kit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Save failed");
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2500);
    } catch {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  const updateColor = (field: keyof SocialBrandKitType, value: string) => {
    onUpdate({ ...kit, [field]: value });
  };

  // ── Upload file to Supabase Storage then add to kit state ──
  const uploadAndAddAsset = useCallback(
    async (
      file: File,
      assetType: "logo" | "product" | "hero",
      field: "logos" | "productImages" | "heroImages",
      currentKit: SocialBrandKitType
    ): Promise<{ asset: BrandAsset; updatedField: BrandAsset[] } | null> => {
      const formData = new FormData();
      formData.append("file", file);

      const params = new URLSearchParams({
        category: assetType,
        brand_id: brandId,
        station_id: stationId,
      });

      const res = await fetch(`/api/social/brand-kit/upload?${params}`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) return null;
      const { url, name } = await res.json();

      const asset: BrandAsset = {
        id: `asset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: name || file.name,
        type: assetType,
        url,
        fileSize: file.size,
        uploadedAt: new Date().toISOString(),
      };

      return { asset, updatedField: [...currentKit[field], asset] };
    },
    [brandId, stationId]
  );

  const processFiles = useCallback(
    async (
      files: FileList,
      assetType: "logo" | "product" | "hero",
      field: "logos" | "productImages" | "heroImages"
    ) => {
      setUploadingCategory(assetType);
      let currentKit = { ...kit };

      for (const file of Array.from(files)) {
        if (!ACCEPTED_TYPES.includes(file.type)) continue;
        if (file.size > MAX_FILE_SIZE) continue;

        const result = await uploadAndAddAsset(file, assetType, field, currentKit);
        if (result) {
          currentKit = { ...currentKit, [field]: result.updatedField };
          onUpdate(currentKit);
        }
      }

      setUploadingCategory(null);
    },
    [kit, onUpdate, uploadAndAddAsset]
  );

  const removeAsset = (field: "logos" | "productImages" | "heroImages", id: string) => {
    onUpdate({ ...kit, [field]: kit[field].filter((a) => a.id !== id) });
  };

  return (
    <div className="p-6 space-y-8">
      {/* ── Save Button ── */}
      <div className="flex items-center justify-between">
        <div />
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
            saveStatus === "saved"
              ? "bg-[#00FF96]/20 text-[#00FF96] border border-[#00FF96]/30"
              : saveStatus === "error"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-[#00FF96] text-[#040810] hover:bg-[#00FF96]/90 active:scale-[0.97]"
          )}
        >
          {saveStatus === "saving" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : saveStatus === "saved" ? (
            <>
              <CheckCircle2 size={16} />
              Brand kit saved
            </>
          ) : saveStatus === "error" ? (
            "Save failed — try again"
          ) : (
            <>
              <Save size={16} />
              Save Brand Kit
            </>
          )}
        </button>
      </div>

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
          uploading={uploadingCategory === "logo"}
        />

        <UploadZone
          label="Product Images"
          icon={ImageIcon}
          assets={kit.productImages}
          onUpload={(files) => processFiles(files, "product", "productImages")}
          onRemove={(id) => removeAsset("productImages", id)}
          uploading={uploadingCategory === "product"}
        />

        <UploadZone
          label="Hero Images"
          icon={ImageIcon}
          assets={kit.heroImages}
          onUpload={(files) => processFiles(files, "hero", "heroImages")}
          onRemove={(id) => removeAsset("heroImages", id)}
          uploading={uploadingCategory === "hero"}
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

      {/* ── Bottom Save Button ── */}
      <div className="flex justify-end pt-2">
        <button
          onClick={handleSave}
          disabled={saveStatus === "saving"}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all",
            saveStatus === "saved"
              ? "bg-[#00FF96]/20 text-[#00FF96] border border-[#00FF96]/30"
              : saveStatus === "error"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-[#00FF96] text-[#040810] hover:bg-[#00FF96]/90 active:scale-[0.97]"
          )}
        >
          {saveStatus === "saving" ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving…
            </>
          ) : saveStatus === "saved" ? (
            <>
              <CheckCircle2 size={16} />
              Brand kit saved
            </>
          ) : saveStatus === "error" ? (
            "Save failed — try again"
          ) : (
            <>
              <Save size={16} />
              Save Brand Kit
            </>
          )}
        </button>
      </div>
    </div>
  );
}
