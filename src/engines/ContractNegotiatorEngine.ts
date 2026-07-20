import {
  NegotiatedContract,
  ParticipantSignature,
} from '../types/contractNegotiator';

import { HardLimitBoundary } from '../types/boundaryBuilder';
import { ScenePlan } from '../types/scenePlanner';

export class ContractNegotiatorEngine {
  public createBlankContract(): NegotiatedContract {
    return {
      id: crypto.randomUUID(),
      sceneId: crypto.randomUUID(),

      relationshipStructure: '',
      clauseVariables: '',
      consentConsiderations: [],
      negotiatedAgreements: [],
      agreementClauses: [],

      lockedHardLimits: [],
      activeSoftLimitAgreements: [],
      finalizedSequence: [],

      isConsensual: false,
      signatures: [],
      revocationLog: [],
    };
  }

  public generateContractDraft(
    scenePlan: ScenePlan,
    boundaries: HardLimitBoundary[]
  ): NegotiatedContract {
    return {
      id: crypto.randomUUID(),
      sceneId: scenePlan.id,

      relationshipStructure: '',
      clauseVariables: '',
      consentConsiderations: [],
      negotiatedAgreements: [],
      agreementClauses: [],

      lockedHardLimits: boundaries.filter(
        (boundary) => boundary.boundaryType === 'hard'
      ),

      activeSoftLimitAgreements:
        scenePlan.softLimitDiscussionOutcomes,

      finalizedSequence: scenePlan.sceneSequence,

      isConsensual: false,
      signatures: [],
      revocationLog: [],
    };
  }

  public validateContractSafety(
    contract: NegotiatedContract
  ): boolean {
    const hardLimitIds = new Set(
      contract.lockedHardLimits.map(
        (boundary) => boundary.activityId
      )
    );

    return !contract.finalizedSequence.some((activityId) =>
      hardLimitIds.has(activityId)
    );
  }

  public executeSignature(
    currentContract: NegotiatedContract,
    newSignature: ParticipantSignature,
    expectedParticipantCount: number = 2
  ): NegotiatedContract {
    const updatedSignatures =
      currentContract.signatures.filter(
        (signature) =>
          signature.participantId !==
          newSignature.participantId
      );

    updatedSignatures.push(newSignature);

    const prospectiveContract: NegotiatedContract = {
      ...currentContract,
      signatures: updatedSignatures,
    };

    const isSafe =
      this.validateContractSafety(prospectiveContract);

    const hasAllSignatures =
      updatedSignatures.length === expectedParticipantCount;

    return {
      ...prospectiveContract,
      isConsensual: isSafe && hasAllSignatures,
    };
  }
}