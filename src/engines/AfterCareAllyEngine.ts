import { AftercarePlan, AftercareTask } from '../types/AfterCareAlly';
import { DownstreamSceneContext } from '../types/downstream';

export class AfterCareAllyEngine {

  /**
   * Generates a structural aftercare matrix based on activities present in the plan
   */
  public generatePlan(sceneContext: Pick<DownstreamSceneContext, 'sceneId' | 'selectedSceneActivities' | 'sceneNotes'>): AftercarePlan {
    const suggestedTasks: AftercareTask[] = [
      // Standard baseline configurations
      {
        id: crypto.randomUUID(),
        category: 'hydration',
        taskDescription: 'Consume at least 500ml of water or electrolyte fluids immediately.',
        isCompleted: false
      },
      {
        id: crypto.randomUUID(),
        category: 'physical',
        taskDescription: 'Perform a comprehensive full-body thermal regulation assessment (blankets, warm layers).',
        isCompleted: false
      },
      {
        id: crypto.randomUUID(),
        category: 'emotional',
        taskDescription: 'Initiate standard grounding dialogue or silent supportive space as preferred.',
        isCompleted: false
      }
    ];

    // Context-Driven Rule Additions
    if (sceneContext.selectedSceneActivities.length > 3) {
      suggestedTasks.push({
        id: crypto.randomUUID(),
        category: 'physical',
        taskDescription: 'Extended high-exertion recovery track: Schedule a full joint flexibility check.',
        isCompleted: false
      });
    }

    if (sceneContext.sceneNotes.toLowerCase().includes('impact') || sceneContext.sceneNotes.toLowerCase().includes('restrict')) {
      suggestedTasks.push({
        id: crypto.randomUUID(),
        category: 'physical',
        taskDescription: 'Inspect localized surface tissue layers for marking, bruising, or circulation updates.',
        isCompleted: false
      });
    }

    return {
      id: crypto.randomUUID(),
      sceneId: sceneContext.sceneId,
      suggestedTasks,
      customNotes: "",
      emergencyContactsVisible: false
    };
  }

  /**
   * Toggles task parameters live within the local active state memory structure
   */
  public toggleTaskState(plan: AftercarePlan, taskId: string): AftercarePlan {
    return {
      ...plan,
      suggestedTasks: plan.suggestedTasks.map(task => 
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    };
  }
}