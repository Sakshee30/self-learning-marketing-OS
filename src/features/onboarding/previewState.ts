import type { CompanyProfileInput, GrowthSetupInput } from "./schemas/onboarding.schema";

export type OnboardingPreviewState = {
  completed: boolean;
  currentStep: number;
  completedSteps: string[];
  connectedSystems: string[];
  companyDraft: CompanyProfileInput | null;
  growthDraft: GrowthSetupInput | null;
  updatedAt: string;
};

const KEY = "growthos-onboarding-preview-v2";

const emptyState = (): OnboardingPreviewState => ({
  completed: false,
  currentStep: 0,
  completedSteps: [],
  connectedSystems: [],
  companyDraft: null,
  growthDraft: null,
  updatedAt: new Date(0).toISOString()
});

export function readOnboardingPreview(): OnboardingPreviewState {
  try {
    const value = sessionStorage.getItem(KEY);
    if (!value) return emptyState();

    const parsed = JSON.parse(value) as Partial<OnboardingPreviewState>;
    return {
      completed: parsed.completed === true,
      currentStep: typeof parsed.currentStep === "number" ? parsed.currentStep : 0,
      completedSteps: Array.isArray(parsed.completedSteps) ? parsed.completedSteps : [],
      connectedSystems: Array.isArray(parsed.connectedSystems) ? parsed.connectedSystems : [],
      companyDraft: parsed.companyDraft ?? null,
      growthDraft: parsed.growthDraft ?? null,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : new Date(0).toISOString()
    };
  } catch {
    return emptyState();
  }
}

export function writeOnboardingPreview(state: OnboardingPreviewState) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Preview recovery is best-effort. The form remains usable when browser storage is unavailable.
  }
}

export function clearOnboardingPreview() {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // Logout continues even when storage is unavailable.
  }
}
