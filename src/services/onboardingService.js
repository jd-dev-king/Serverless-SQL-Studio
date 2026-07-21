const ONBOARDING_KEY = "serverless-sql-studio.onboarding-complete";

export function shouldShowOnboarding() {
  return localStorage.getItem(ONBOARDING_KEY) !== "true";
}

export function completeOnboarding() {
  localStorage.setItem(ONBOARDING_KEY, "true");
}

export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
}
