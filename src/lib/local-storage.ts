// src/lib/local-storage.ts
import type { 
  ChecklistResponse, 
  BoundaryRecord, 
  ScenePlan, 
  AgreementRecord, 
  AftercarePlan, 
  ReflectionSession 
} from './hub-types';

const PREFIX = 'journey-unbound:kinksploration';

export const LocalStorageKeys = {
  checklistResponses: `${PREFIX}:checklist-responses`,
  boundaries: `${PREFIX}:boundaries`,
  scenePlans: `${PREFIX}:scene-plans`,
  agreements: `${PREFIX}:agreements`,
  aftercarePlans: `${PREFIX}:aftercare-plans`,
  reflections: `${PREFIX}:reflections`,
} as const;

export function readLocalData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalData(key: string): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(key);
}

// Strongly typed application wrapper API
export const KinksplorationStorage = {
  // Checklist Responses
  getChecklistResponses: (): ChecklistResponse[] => 
    readLocalData<ChecklistResponse[]>(LocalStorageKeys.checklistResponses, []),
  saveChecklistResponses: (data: ChecklistResponse[]): void => 
    writeLocalData(LocalStorageKeys.checklistResponses, data),

  // Boundary Builder
  getBoundaries: (): BoundaryRecord[] => 
    readLocalData<BoundaryRecord[]>(LocalStorageKeys.boundaries, []),
  saveBoundaries: (data: BoundaryRecord[]): void => 
    writeLocalData(LocalStorageKeys.boundaries, data),

  // Scene Planner
  getScenePlans: (): ScenePlan[] => 
    readLocalData<ScenePlan[]>(LocalStorageKeys.scenePlans, []),
  saveScenePlans: (data: ScenePlan[]): void => 
    writeLocalData(LocalStorageKeys.scenePlans, data),

  // Contract Negotiator
  getAgreements: (): AgreementRecord[] => 
    readLocalData<AgreementRecord[]>(LocalStorageKeys.agreements, []),
  saveAgreements: (data: AgreementRecord[]): void => 
    writeLocalData(LocalStorageKeys.agreements, data),

  // Aftercare Ally
  getAftercarePlans: (): AftercarePlan[] => 
    readLocalData<AftercarePlan[]>(LocalStorageKeys.aftercarePlans, []),
  saveAftercarePlans: (data: AftercarePlan[]): void => 
    writeLocalData(LocalStorageKeys.aftercarePlans, data),

  // The Unwind
  getReflections: (): ReflectionSession[] => 
    readLocalData<ReflectionSession[]>(LocalStorageKeys.reflections, []),
  saveReflections: (data: ReflectionSession[]): void => 
    writeLocalData(LocalStorageKeys.reflections, data),
    
  // Global Reset
  clearAllUserData: (): void => {
    if (typeof window === 'undefined') return;
    Object.values(LocalStorageKeys).forEach(key => removeLocalData(key));
  }
};