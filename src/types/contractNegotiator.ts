import { HardLimitBoundary } from './boundaryBuilder';
import { SoftLimitDiscussionOutcome } from './scenePlanner';

export interface ParticipantSignature {
  participantId: string;
  signedAt: string;
  ipAddress?: string;
}

export interface NegotiatedContract {
  id: string;
  sceneId: string;

  relationshipStructure: string;
  clauseVariables: string;
  consentConsiderations: string[];
  negotiatedAgreements: string[];
  agreementClauses: string[];

  lockedHardLimits: HardLimitBoundary[];
  activeSoftLimitAgreements: SoftLimitDiscussionOutcome[];
  finalizedSequence: string[];

  isConsensual: boolean;
  signatures: ParticipantSignature[];

  revocationLog: {
    participantId: string;
    timestamp: string;
    reason?: string;
  }[];
}