export type OnboardingPreviewState = {
  completed: boolean;
  completedSteps: string[];
  updatedAt: string;
};

const KEY = "growthos-onboarding-preview";

export function readOnboardingPreview(): OnboardingPreviewState {
  try {
    const value = localStorage.getItem(KEY);
    if (!value) return { completed: false, completedSteps: [], updatedAt: new Date(0).toISOString() };
    return JSON.parse(value) as OnboardingPreviewState;
  } catch {
    return { completed: false, completedSteps: [], updatedAt: new Date(0).toISOString() };
  }
}

export function writeOnboardingPreview(state: OnboardingPreviewState) {
  localStorage.setItem(KEY, JSON.stringify(state));
}
