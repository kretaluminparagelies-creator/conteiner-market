/**
 * @file detect-webgl.ts
 * @description WebGL availability probe + session guard after context loss
 * @author Katsoulakis
 * @copyright 2026 Katsoulakis. All rights reserved.
 */

const sessionKey = "cm-webgl-blocked";

let cachedAvailability: boolean | null = null;

export function isWebGLBlockedInSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    return sessionStorage.getItem(sessionKey) === "1";
  } catch {
    return false;
  }
}

export function markWebGLBlocked(): void {
  cachedAvailability = false;

  try {
    sessionStorage.setItem(sessionKey, "1");
  } catch {
    // ignore storage errors
  }
}

export function canUseWebGL(): boolean {
  if (typeof window === "undefined") return false;
  if (isWebGLBlockedInSession()) return false;
  if (cachedAvailability !== null) return cachedAvailability;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2", {
        antialias: true,
        failIfMajorPerformanceCaveat: false,
        powerPreference: "high-performance",
      }) ??
      canvas.getContext("webgl", {
        antialias: true,
        failIfMajorPerformanceCaveat: false,
        powerPreference: "high-performance",
      });

    if (!context) {
      cachedAvailability = false;
      return false;
    }

    const loseContext = context.getExtension("WEBGL_lose_context");
    loseContext?.loseContext();
    cachedAvailability = true;
    return true;
  } catch {
    cachedAvailability = false;
    return false;
  }
}

export function isWebGLRelatedError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return /webgl|three\.webglrenderer/i.test(message);
}
