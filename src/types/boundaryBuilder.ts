export interface NSRSentence {
  need: string;          // Core underlying value/safety pillar
  situation: string;     // The specific activity or scenario
  request: string;       // The explicit, actionable boundary request
  formattedText: string; // The unified stitched sentence
}

export interface HardLimitBoundary {
  activityId: string;
  activityName: string;
  nsrScript: NSRSentence;
  isConfirmed: boolean;
}

export interface BoundaryBuilderContext {
  userId: string;
  hardLimitBoundaries: HardLimitBoundary[];
  completedAt?: string;
}