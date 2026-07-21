const ONBOARDING_KEY = "serverless-sql-studio.onboarding-complete";
const ONBOARDING_DISMISS_KEY = "serverless-sql-studio.onboarding-dismissed";

export function shouldShowOnboarding() {
  return (
    localStorage.getItem(ONBOARDING_KEY) !== "true" &&
    localStorage.getItem(ONBOARDING_DISMISS_KEY) !== "true"
  );
}

export function completeOnboarding({ dontShowAgain = true } = {}) {
  localStorage.setItem(ONBOARDING_KEY, "true");

  if (dontShowAgain) {
    localStorage.setItem(ONBOARDING_DISMISS_KEY, "true");
  } else {
    localStorage.removeItem(ONBOARDING_DISMISS_KEY);
  }
}

export function dismissOnboarding({ dontShowAgain = true } = {}) {
  if (dontShowAgain) {
    localStorage.setItem(ONBOARDING_DISMISS_KEY, "true");
  } else {
    localStorage.removeItem(ONBOARDING_DISMISS_KEY);
  }
}

export function resetOnboarding() {
  localStorage.removeItem(ONBOARDING_KEY);
  localStorage.removeItem(ONBOARDING_DISMISS_KEY);
}

export function restartOnboarding() {
  resetOnboarding();
}
