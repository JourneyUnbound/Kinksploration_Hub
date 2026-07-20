import { ScenePlan, ChecklistActivity, ChecklistSuggestions, SceneElement } from '../types/scenePlanner';

export class ScenePlannerEngine {
  
  /**
   * Path 1: Blank Scene
   * Opens a clean structured document without requiring prompts or checklist data[cite: 2].
   */
  public createBlankScene(): ScenePlan {
    return this.createEmptyStructuredDocument();
  }

  /**
   * Path 2: Guided Planning
   * Builds structural workspace templates using optional elements[cite: 2].
   */
  public createGuidedScene(sceneElements: SceneElement[]): ScenePlan {
    const basePlan = this.createEmptyStructuredDocument();
    
    basePlan.sceneNotes = sceneElements
      .map(element => `## ${element.sectionTitle}\n*${element.promptText}*\n\n`)
      .join('\n');
      
    return basePlan;
  }

  /**
   * Path 3: Checklist Assisted Planning
   * Implements strict filtration business rules using brand thresholds[cite: 2].
   */
  public processChecklistData(activities: ChecklistActivity[]): ChecklistSuggestions {
    const suggestedActivities: ChecklistActivity[] = [];
    const discussionOpportunities: ChecklistActivity[] = [];

    for (const activity of activities) {
      // Business Rule: Hard Limits (#BD1515) MUST be hidden from choices[cite: 2, 3]
      if (activity.isHardLimit) {
        continue; 
      }

      // Business Rule: 4★ and 5★ are prioritized as suggestions[cite: 2]
      if (activity.rating === 4 || activity.rating === 5) {
        suggestedActivities.push(activity);
      }

      // Business Rule: 2★, 3★, and Soft Limits are discussion opportunities[cite: 2]
      if (activity.rating === 2 || activity.rating === 3 || activity.isSoftLimit) {
        if (!discussionOpportunities.some(a => a.id === activity.id)) {
          discussionOpportunities.push(activity);
        }
      }
    }

    return { suggestedActivities, discussionOpportunities };
  }

  /**
   * Enforces that soft limit outcomes are only saved if the activity is explicitly included[cite: 2].
   */
  public finalizeScenePlan(rawPlan: ScenePlan, allActivities: ChecklistActivity[]): ScenePlan {
    const activeOutcomes = rawPlan.softLimitDiscussionOutcomes.filter(outcome => 
      rawPlan.selectedSceneActivities.includes(outcome.activityId)
    );

    const cleanActivities = rawPlan.selectedSceneActivities.filter(activityId => {
      const match = allActivities.find(a => a.id === activityId);
      return !(match?.isHardLimit);
    });

    return {
      ...rawPlan,
      selectedSceneActivities: cleanActivities,
      softLimitDiscussionOutcomes: activeOutcomes
    };
  }

  private createEmptyStructuredDocument(): ScenePlan {
    return {
      id: crypto.randomUUID(),
      selectedSceneActivities: [],
      sceneObjectives: [],
      sceneNotes: "",
      softLimitDiscussionOutcomes: [],
      sceneSequence: [],
      requiredEquipmentChecklist: [],
      environmentConsiderations: [],
      safetyChecklist: [],
      riskAcknowledgements: [],
      preSceneChecklist: []
    };
  }
  }
