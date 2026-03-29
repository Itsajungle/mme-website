import type { SocialBrandKit } from './brand-kit-types';

/**
 * Generate a text summary of the brand kit for AI prompt context.
 * Used by content generation to ensure brand consistency.
 */
export function getBrandKitContext(kit: SocialBrandKit): string {
  const parts: string[] = [];

  if (kit.tagline) parts.push(`Brand tagline: "${kit.tagline}"`);
  if (kit.toneOfVoice) parts.push(`Tone of voice: ${kit.toneOfVoice}`);
  if (kit.primaryColor) parts.push(`Brand primary colour: ${kit.primaryColor}`);
  if (kit.logos.length > 0) parts.push(`Brand has ${kit.logos.length} logo(s) available`);
  if (kit.productImages.length > 0) parts.push(`Brand has ${kit.productImages.length} product image(s) available`);

  return parts.length > 0
    ? `\n\nBrand Kit Context:\n${parts.join('\n')}`
    : '';
}
