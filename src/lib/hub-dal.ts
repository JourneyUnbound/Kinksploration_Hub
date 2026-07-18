// src/lib/hub-dal.ts
import { supabaseClient } from './supabase-client';
import type {
  Activity,
  GenericPromptRecord,
  Need,
  ReflectionPrompt,
  Scene,
  SceneElement,
} from './hub-types';

/**
 * Generic internal fetch helper that pulls catalog records from Supabase
 * sorted explicitly by their intended UI presentation order.
 */
async function fetchOrderedTable<T>(table: string): Promise<T[]> {
  const { data, error } = await supabaseClient
    .from(table)
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    throw new Error(`Failed to load ${table}: ${error.message}`);
  }

  return (data ?? []) as T[];
}

/**
 * Hub Data Access Layer (DAL)
 * Authoritative, read-only catalog fetch methods powering the interactive modules.
 */
export const HubDAL = {
  // 1. Kinksploration™ Checklist Catalogs
  fetchActivities: () => fetchOrderedTable<Activity>('activities'),
  fetchNeeds: () => fetchOrderedTable<Need>('needs'),

  // 2. Boundary Builder Catalogs
  fetchBoundaries: () => fetchOrderedTable<GenericPromptRecord>('boundaries'),
  fetchConsentPhrases: () => fetchOrderedTable<GenericPromptRecord>('consent_phrases'),

  // 3. Scene Planner Catalogs
  fetchScenes: () => fetchOrderedTable<Scene>('scenes'),
  fetchSceneElements: () => fetchOrderedTable<SceneElement>('scene_elements'),

  // 4. Contract Negotiator Catalogs
  fetchRelationshipStructures: () => fetchOrderedTable<GenericPromptRecord>('relationship_structures'),
  fetchRelationshipDynamics: () => fetchOrderedTable<GenericPromptRecord>('relationship_dynamics'),
  fetchAgreementDefinitions: () => fetchOrderedTable<GenericPromptRecord>('agreement_definitions'),
  fetchAgreementElements: () => fetchOrderedTable<GenericPromptRecord>('agreement_elements'),

  // 5. AfterCare Ally Catalogs
  fetchAftercareCategories: () => fetchOrderedTable<GenericPromptRecord>('aftercare_categories'),
  fetchAftercareActivities: () => fetchOrderedTable<GenericPromptRecord>('aftercare_activities'),
  fetchAftercareItems: () => fetchOrderedTable<GenericPromptRecord>('aftercare_items'),

  // 6. The Unwind Catalogs
  fetchReflectionCategories: () => fetchOrderedTable<GenericPromptRecord>('reflection_categories'),
  fetchReflectionPrompts: () => fetchOrderedTable<ReflectionPrompt>('reflection_prompts'),
};