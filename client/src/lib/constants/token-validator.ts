/**
 * Validates JWT token format and expiration
 * @param token - JWT token string
 * @returns boolean indicating if token is valid
 */
export function isTokenValid(token: string | null): boolean {
  if (!token || typeof token !== "string") {
    return false;
  }

  try {
    // JWT format: header.payload.signature
    const parts = token.split(".");
    if (parts.length !== 3) {
      return false;
    }

    // Decode payload (second part)
    const payload = JSON.parse(atob(parts[1]));

    // Check if token has expiration
    if (!payload.exp) {
      return false;
    }

    // Check if token is expired (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp < currentTime) {
      return false;
    }

    return true;
  } catch (error) {
    // Token is malformed or cannot be decoded
    return false;
  }
}

/**
 * Extracts token expiration time
 * @param token - JWT token string
 * @returns expiration timestamp or null
 */
export function getTokenExpiration(token: string | null): number | null {
  if (!token) return null;

  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(atob(parts[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to milliseconds
  } catch {
    return null;
  }
}
