import { ReflectionFramework, ReflectionMetrics } from '../types/theUnwind';
import { DownstreamSceneContext } from '../types/downstream';

export class TheUnwindEngine {

  /**
   * Initializes a fresh structure for self-reflection using the complete downstream context payload
   */
  public initializeReflection(sceneContext: DownstreamSceneContext): ReflectionFramework {
    return {
      id: crypto.randomUUID(),
      sceneId: sceneContext.sceneId,
      metrics: {
        boundaryRespectScore: 5, // Defaults to optimal state for scale verification
        communicationClarity: 5,
        emotionalGroundingTime: 0
      },
      keyTakeaways: "",
      whatWentWell: "",
      growthOpportunities: "",
      hasSharedWithPartner: false,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Persists numerical metrics updates safely to the integration state model
   */
  public updateMetrics(
    framework: ReflectionFramework,
    updatedMetrics: Partial<ReflectionMetrics>
  ): ReflectionFramework {
    return {
      ...framework,
      metrics: {
        ...framework.metrics,
        ...updatedMetrics
      }
    };
  }
}