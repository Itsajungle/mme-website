// Diagnostic endpoint to verify audio engine configuration
// GET /api/audio/status — returns which engines are configured

export async function GET() {
  const elevenlabsKey = process.env.ELEVENLABS_API_KEY;
  const elevenlabsVoice = process.env.ELEVENLABS_VOICE_ID;
  const jamendoKey = process.env.JAMENDO_CLIENT_ID;
  const freesoundKey = process.env.FREESOUND_API_KEY;

  const status = {
    voice: {
      configured: !!(elevenlabsKey && !elevenlabsKey.startsWith("sk_your_")),
      keyPrefix: elevenlabsKey ? elevenlabsKey.slice(0, 8) + "..." : "NOT SET",
      defaultVoiceId: elevenlabsVoice || "NOT SET",
    },
    music: {
      configured: !!(jamendoKey && !jamendoKey.startsWith("your_")),
      keyPrefix: jamendoKey ? jamendoKey.slice(0, 8) + "..." : "NOT SET",
    },
    sfx: {
      configured: !!(freesoundKey && !freesoundKey.startsWith("your_")),
      keyPrefix: freesoundKey ? freesoundKey.slice(0, 8) + "..." : "NOT SET",
    },
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasAnthropicKey: !!process.env.ANTHROPIC_API_KEY,
      hasGeminiKey: !!process.env.GEMINI_API_KEY,
    },
    timestamp: new Date().toISOString(),
  };

  return Response.json(status);
}
