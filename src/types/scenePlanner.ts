export interface Activity {
  id: string;
  name: string;
  description?: string;
}

export interface Scene {
  id: string;
  name: string;
  description?: string;
}

export interface SceneElement {
  id: string;
  sectionTitle: string;
  promptText: string;
}

export type ActivityRating = 1 | 2 | 3 | 4 | 5;

export interface ChecklistActivity {
  id: string;
  name: string;
  rating: ActivityRating;
  isHardLimit: boolean;
  isSoftLimit: boolean;
  category?: string | null;
  subgroup?: string | null;
  aliases?: string[];
  tooltip?: string | null;
}

export interface SoftLimitDiscussionOutcome {
  activityId: string;
  discussionNotes: string;
  agreedBoundaries: string;
}

export interface ScenePlan {
  id: string;
  selectedSceneActivities: string[];
  sceneObjectives: string[];
  sceneNotes: string;
  softLimitDiscussionOutcomes: SoftLimitDiscussionOutcome[];
  sceneSequence: string[];
  requiredEquipmentChecklist: string[];
  environmentConsiderations: string[];
  safetyChecklist: string[];
  riskAcknowledgements: string[];
  preSceneChecklist: string[];
}

export interface ChecklistSuggestions {
  suggestedActivities: ChecklistActivity[];
  discussionOpportunities: ChecklistActivity[];
}
