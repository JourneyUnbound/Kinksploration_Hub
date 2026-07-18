export interface ReflectionMetrics {
  boundaryRespectScore: number;
  communicationClarity: number;
  emotionalGroundingTime: number;
}

export interface ReflectionFramework {
  id: string;
  sceneId: string;
  metrics: ReflectionMetrics;
  keyTakeaways: string;
  whatWentWell: string;
  growthOpportunities: string;
  hasSharedWithPartner: boolean;
  createdAt: string;
}
