/**
 * Wraps fetch() to handle session invalidation globally.
 *
 * If the backend returns a 401 with code SESSION_INVALIDATED (meaning the user
 * logged in from another device), this clears local auth state and redirects
 * to the login page with an explanatory message.
 */
export async function sessionAwareFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const response = await fetch(input, init);

  if (response.status === 401) {
    // Clone so body can be read without consuming the original
    const cloned = response.clone();
    try {
      const body = await cloned.json();
      if (body?.code === "SESSION_INVALIDATED") {
        // Clear all auth data
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");

        // Redirect to login with a message flag
        window.location.href = "/login?reason=session_invalidated";
        // Return a never-resolving promise since we're navigating away
        return new Promise(() => {});
      }
    } catch {
      // Body wasn't JSON — fall through to normal 401 handling
    }
  }

  return response;
}
