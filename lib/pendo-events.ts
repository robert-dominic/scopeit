/**
 * Pendo Track Event functions for ScopeIt.
 *
 * Each exported function wraps a pendo.track() call for a specific business
 * event. Import and call the relevant function from the handler that
 * performs the tracked action (e.g. after successful auth, after AI
 * response, after PDF download).
 */

/** Fires after a new user completes sign-up and their account is created. */
export function trackUserSignedUp(metadata: {
  auth_method: string;
  referral_source?: string;
}) {
  pendo.track("user_signed_up", {
    auth_method: metadata.auth_method,
    referral_source: metadata.referral_source || "direct",
  });
}

/** Fires after an existing user successfully authenticates. */
export function trackUserSignedIn(metadata: {
  auth_method: string;
}) {
  pendo.track("user_signed_in", {
    auth_method: metadata.auth_method,
  });
}

/** Fires when a user submits their messy product idea for AI processing. */
export function trackScopeIdeaSubmitted(metadata: {
  idea_length: number;
  idea_word_count: number;
}) {
  pendo.track("scope_idea_submitted", {
    idea_length: metadata.idea_length,
    idea_word_count: metadata.idea_word_count,
  });
}

/** Fires when the AI successfully generates a structured MVP scope. */
export function trackScopeGenerated(metadata: {
  generation_duration_ms: number;
  scope_sections_count: number;
  features_included_count: number;
  features_excluded_count: number;
  phases_count: number;
}) {
  pendo.track("scope_generated", {
    generation_duration_ms: metadata.generation_duration_ms,
    scope_sections_count: metadata.scope_sections_count,
    features_included_count: metadata.features_included_count,
    features_excluded_count: metadata.features_excluded_count,
    phases_count: metadata.phases_count,
  });
}

/** Fires after a user successfully exports their scope as a PDF. */
export function trackScopeExportedPdf(metadata: {
  scope_id: string;
  page_count: number;
}) {
  pendo.track("scope_exported_pdf", {
    scope_id: metadata.scope_id,
    page_count: metadata.page_count,
    export_format: "pdf",
  });
}
