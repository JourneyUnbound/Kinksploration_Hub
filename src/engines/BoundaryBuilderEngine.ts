import { HardLimitBoundary, NSRSentence } from '../types/boundaryBuilder';
import { ChecklistActivity } from '../types/scenePlanner';

export class BoundaryBuilderEngine {

  /**
   * Filters raw ChecklistActivity array for hard limits and initializes
   * editable Need->Situation->Request (NSR) sentence templates.
   */
  public initializeHardLimits(activities: ChecklistActivity[]): HardLimitBoundary[] {
    return activities
      .filter((a) => a.isHardLimit)
      .map((a) => ({
        activityId: a.id,
        activityName: a.name,
        boundaryType: 'hard',
        isConfirmed: false,
        nsrScript: {
          need: '',
          situation: a.name,
          request: 'this activity is completely off-limits and non-negotiable',
          formattedText: `I need to feel safe. When it comes to ${a.name}, I request that this activity is completely off-limits and non-negotiable.`,
        },
      }));
  }


  public initializeSoftLimits(activities: ChecklistActivity[]): HardLimitBoundary[] {
    return activities
      .filter((a) => a.isSoftLimit)
      .map((a) => ({
        activityId: a.id,
        activityName: a.name,
        boundaryType: 'soft' as const,
        isConfirmed: false,
        nsrScript: {
          need: '',
          situation: a.name,
          request: 'we discuss this activity and agree on the conditions before including it',
          formattedText: `When it comes to ${a.name}, I request that we discuss it and agree on the conditions before including it.`,
        },
      }));
  }

  /**
   * Updates specific NSR fields and auto-regenerates the formattedText stitch.
   */
  public updateNSRPart(
    boundary: HardLimitBoundary,
    updates: Partial<Omit<NSRSentence, 'formattedText'>>
  ): HardLimitBoundary {
    const draftScript: Omit<NSRSentence, 'formattedText'> = {
      need: updates.need !== undefined ? updates.need : boundary.nsrScript.need,
      situation: updates.situation !== undefined ? updates.situation : boundary.nsrScript.situation,
      request: updates.request !== undefined ? updates.request : boundary.nsrScript.request,
    };

    const updatedScript: NSRSentence = {
      ...draftScript,
      formattedText: this.stitchNSR(draftScript),
    };

    return {
      ...boundary,
      nsrScript: updatedScript,
    };
  }

  /**
   * Internal NSR sentence stitcher following Need-Situation-Request grammar.
   */
  private stitchNSR(script: Omit<NSRSentence, 'formattedText'>): string {
    const needPart = script.need ? `I need ${script.need}` : '';
    const situationPart = script.situation ? `when it comes to ${script.situation}` : '';
    const requestPart = script.request ? `I request that ${script.request}` : '';

    const segments = [needPart, situationPart, requestPart].filter((s) => s.length > 0);

    if (segments.length === 0) {
      return 'Boundary statement incomplete — please fill in Need, Situation, and Request.';
    }

    if (needPart && situationPart && requestPart) {
      return `${needPart}, ${situationPart}, and ${requestPart}.`;
    }
    if (needPart && requestPart) {
      return `${needPart}, and ${requestPart}.`;
    }
    return `${segments.join(', ')}.`;
  }
}
