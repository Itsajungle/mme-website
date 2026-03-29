export interface SocialBrandKit {
  id: string;
  brandSlug: string;
  // Visual identity
  logos: BrandAsset[];
  productImages: BrandAsset[];
  heroImages: BrandAsset[];
  // Brand colours
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  // Typography
  headlineFont: string;
  bodyFont: string;
  // Brand voice
  toneOfVoice: string;
  tagline: string;
}

export interface BrandAsset {
  id: string;
  name: string;
  type: 'logo' | 'product' | 'hero' | 'other';
  url: string;
  thumbnail?: string;
  width?: number;
  height?: number;
  fileSize?: number;
  uploadedAt: string;
}

export const DEFAULT_SOCIAL_BRAND_KIT: SocialBrandKit = {
  id: 'sbk-default',
  brandSlug: '',
  logos: [],
  productImages: [],
  heroImages: [],
  primaryColor: '#00FF96',
  secondaryColor: '#0A0F1E',
  accentColor: '#F59E0B',
  backgroundColor: '#040810',
  headlineFont: 'Montserrat',
  bodyFont: 'Open Sans',
  toneOfVoice: '',
  tagline: '',
};
