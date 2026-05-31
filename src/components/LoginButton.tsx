"use client";

import { useState } from "react";

export function LoginButton() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn() {
    setError("");
    setIsLoading(true);

    try {
      const csrfResponse = await fetch("/api/auth/csrf");
      const { csrfToken } = (await csrfResponse.json()) as { csrfToken?: string };

      if (!csrfToken) {
        throw new Error("Unable to start Google sign-in.");
      }

      const response = await fetch("/api/auth/signin/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          csrfToken,
          callbackUrl: `${window.location.origin}/`,
          json: "true",
        }),
      });
      const body = (await response.json()) as { url?: string };

      if (!body.url) {
        throw new Error("Google sign-in did not return a redirect URL.");
      }

      window.location.assign(body.url);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to start Google sign-in.",
      );
      setIsLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => void handleSignIn()}
        disabled={isLoading}
        className="inline-flex min-h-11 items-center justify-center rounded-full bg-primary px-5 text-[15px] font-semibold text-white transition hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-bg disabled:cursor-not-allowed disabled:bg-text-muted"
      >
        {isLoading ? "Opening Google" : "Continue with Google"}
      </button>
      {error ? <p className="mt-3 text-sm font-medium text-status-missed">{error}</p> : null}
    </div>
  );
}
