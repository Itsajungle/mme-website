import type { ServiceStatus } from "@/lib/social-engine/types";

const isSet = (key: string): boolean => {
  const v = process.env[key];
  return (
    !!v &&
    !v.startsWith("xxx") &&
    !v.startsWith("sk_your_") &&
    !v.startsWith("your_")
  );
};

export async function GET() {
  const status: ServiceStatus = {
    // Content generation AI (Gemini)
    contentAI: isSet("GEMINI_API_KEY") ? "live" : "demo",

    // Image AI (fal.ai or OpenAI)
    imageAI: isSet("FAL_API_KEY") || isSet("OPENAI_API_KEY") ? "live" : "demo",

    // Quality chain (Anthropic)
    qualityChain: isSet("ANTHROPIC_API_KEY") ? "live" : "demo",

    // Social platforms
    instagram:
      isSet("INSTAGRAM_ACCESS_TOKEN") && isSet("INSTAGRAM_BUSINESS_ACCOUNT_ID")
        ? "live"
        : "demo",

    linkedin:
      isSet("LINKEDIN_ACCESS_TOKEN") && isSet("LINKEDIN_PERSON_URN")
        ? "live"
        : "demo",

    x:
      isSet("X_API_KEY") &&
      isSet("X_API_SECRET") &&
      isSet("X_ACCESS_TOKEN") &&
      isSet("X_ACCESS_SECRET")
        ? "live"
        : "demo",

    facebook:
      isSet("FACEBOOK_PAGE_ACCESS_TOKEN") && isSet("FACEBOOK_PAGE_ID")
        ? "live"
        : "demo",
  };

  return Response.json({ status });
}
