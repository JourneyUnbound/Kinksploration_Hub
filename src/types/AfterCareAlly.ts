export interface AftercareTask {
  id: string;
  category: 'physical' | 'emotional' | 'hydration' | 'environment';
  taskDescription: string;
  isCompleted: boolean;
  notes?: string;
}

export interface AftercarePlan {
  id: string;
  sceneId: string;
  suggestedTasks: AftercareTask[];
  customNotes: string;
  emergencyContactsVisible: boolean;
}