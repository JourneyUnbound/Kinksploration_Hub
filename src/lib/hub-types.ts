export interface CatalogRecord {
  id: string;
  name: string;
  display_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Activity extends CatalogRecord {
  tooltip?: string | null;
  category?: string | null;
  subgroup?: string | null;
  aliases: string[];
  status: string;
  notes?: string | null;
}

export interface Need extends CatalogRecord {
  category?: string | null;
  type?: string | null;
  description?: string | null;
}

export interface Scene extends CatalogRecord {
  aliases: string[];
  description?: string | null;
  category?: string | null;
}

export interface SceneElement extends CatalogRecord {
  category?: string | null;
  description?: string | null;
  prompt?: string | null;
}

export interface GenericPromptRecord extends CatalogRecord {
  category?: string | null;
  description?: string | null;
  prompt?: string | null;
  notes?: string | null;
}

export interface ReflectionPrompt {
  id: string;
  prompt: string;
  category?: string | null;
  description?: string | null;
  notes?: string | null;
  display_order?: number;
}

export interface ChecklistResponse {
  activityId: string;
  ratingStars: number;
  experienceStatus: string;
  isHardLimit: boolean;
  isSoftLimit: boolean;
  fetishToggle: boolean;
  personalNotes?: string;
  markVisited: boolean;
}

export interface BoundaryRecord {
  activityId?: string;
  boundaryType: 'Hard' | 'Soft' | string;
  statement: string;
  notes?: string;
}

export interface ScenePlan {
  id: string;
  name: string;
  sceneId?: string;
  selectedActivityIds: string[];
  selectedElementIds: string[];
  notes?: string;
  updatedAt: string;
}

export interface AgreementRecord {
  id: string;
  title: string;
  relationshipStructureId?: string;
  relationshipDynamicIds: string[];
  selectedDefinitionIds: string[];
  selectedElementIds: string[];
  clauses: string[];
  updatedAt: string;
}

export interface AftercarePlan {
  id: string;
  scenePlanId?: string;
  selectedActivityIds: string[];
  selectedItemIds: string[];
  notes?: string;
  updatedAt: string;
}

export interface ReflectionSession {
  id: string;
  scenePlanId?: string;
  boundaryIds: string[];
  responses: Record<string, string>;
  notes?: string;
  updatedAt: string;
}
