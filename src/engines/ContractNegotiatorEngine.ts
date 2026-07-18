import { NegotiatedContract, ParticipantSignature } from '../types/contractNegotiator';
import { HardLimitBoundary } from '../types/boundaryBuilder';
import { ScenePlan } from '../types/scenePlanner';

export class ContractNegotiatorEngine {

  public generateContractDraft(
    scenePlan: ScenePlan,
    confirmedBoundaries: HardLimitBoundary[]
  ): NegotiatedContract {
    return {
      id: crypto.randomUUID(),
      sceneId: scenePlan.id,
      lockedHardLimits: confirmedBoundaries.filter((b) => b.isConfirmed),
      activeSoftLimitAgreements: scenePlan.softLimitDiscussionOutcomes,
      finalizedSequence: scenePlan.sceneSequence,
      isConsensual: false,
      signatures: [],
      revocationLog: []
    };
  }

  public validateContractSafety(contract: NegotiatedContract): boolean {
    const hardLimitIds = new Set(contract.lockedHardLimits.map((b) => b.activityId));
    for (const activityId of contract.finalizedSequence) {
      if (hardLimitIds.has(activityId)) {
        return false;
      }
    }
    return true;
  }

  public executeSignature(
    currentContract: NegotiatedContract,
    newSignature: ParticipantSignature,
    expectedParticipantCount: number = 2
  ): NegotiatedContract {
    const updatedSignatures = currentContract.signatures.filter(
      (sig) => sig.participantId !== newSignature.participantId
    );
    updatedSignatures.push(newSignature);

    const prospectiveContract: NegotiatedContract = {
      ...currentContract,
      signatures: updatedSignatures,
    };

    const isSafe = this.validateContractSafety(prospectiveContract);
    const hasAllSignatures = updatedSignatures.length === expectedParticipantCount;

    return {
      ...prospectiveContract,
      isConsensual: isSafe && hasAllSignatures
    };
  }
}
