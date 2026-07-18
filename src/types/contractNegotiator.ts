import { HardLimitBoundary } from './boundaryBuilder';
import { SoftLimitDiscussionOutcome } from './scenePlanner';

export interface ParticipantSignature {
  participantId: string;
  signedAt: string;
  ipAddress?: string; // Optional metadata for verification tracking
}

export interface NegotiatedContract {
  id: string;
  sceneId: string;
  // Read-only snapshots brought forward from previous phases to freeze terms
  lockedHardLimits: HardLimitBoundary[];
  activeSoftLimitAgreements: SoftLimitDiscussionOutcome[];
  finalizedSequence: string[];
  
  // Consent Tracking States
  isConsensual: boolean;
  signatures: ParticipantSignature[];
  revocationLog: {
    participantId: string;
    timestamp: string;
    reason?: string;
  }[];
}