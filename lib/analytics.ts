import { track } from "@vercel/analytics";

// The complete custom-event surface. Keep this list small and typo-proof —
// it mirrors content/profile.json → analytics.events.
export type AnalyticsEvent =
  | "resume_viewed"
  | "schedule_call_clicked"
  | "chat_opened"
  | "chat_message_sent"
  | "linkedin_clicked"
  | "github_clicked"
  | "email_clicked"
  | "youtube_clicked"
  | "project_expanded"
  | "theme_toggled";

export function logEvent(
  event: AnalyticsEvent,
  props?: Record<string, string>,
): void {
  // No-ops automatically in dev / when Web Analytics is disabled.
  track(event, props);
}
