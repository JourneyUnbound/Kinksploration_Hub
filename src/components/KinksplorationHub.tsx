'use client';
import React, { useState, useMemo } from 'react';
import '../styles/brandVariables.css';

// 1. Data Types & Engines
import { ChecklistActivity, ScenePlan } from '../types/scenePlanner';
import { HardLimitBoundary, NSRSentence } from '../types/boundaryBuilder';
import { NegotiatedContract, ParticipantSignature } from '../types/contractNegotiator';
import { AftercarePlan } from '../types/afterCareAlly';
import { ReflectionFramework, ReflectionMetrics } from '../types/theUnwind';

import { BoundaryBuilderEngine } from '../engines/BoundaryBuilderEngine';
import { ScenePlannerEngine } from '../engines/ScenePlannerEngine';
import { ContractNegotiatorEngine } from '../engines/ContractNegotiatorEngine';
import { AfterCareAllyEngine } from '../engines/AfterCareAllyEngine';
import { TheUnwindEngine } from '../engines/TheUnwindEngine';

// 2. Sub-Component View Layers
import { HardLimitNSRView } from './BoundaryBuilder/HardLimitNSRView';
import { ChecklistAssistedView } from './ScenePlanner/ChecklistAssistedView';
import { ConsentHandshakeView } from './ContractNegotiator/ConsentHandshakeView';
import { AftercareDashboardView } from './AftercareAlly/AftercareDashboardView';
import { ReflectionView } from './TheUnwind/ReflectionView';

// 3. Define the Explicit Phase/Step Enums
type WorkflowStep = 'boundaries' | 'planner' | 'negotiator' | 'aftercare' | 'unwind';

interface KinksplorationHubProps {
  initialChecklistActivities: ChecklistActivity[];
  currentUserId: string;
}

export const KinksplorationHub: React.FC<KinksplorationHubProps> = ({
  initialChecklistActivities,
  currentUserId
}) => {
  const bbEngine = useMemo(() => new BoundaryBuilderEngine(), []);
  const spEngine = useMemo(() => new ScenePlannerEngine(), []);
  const cnEngine = useMemo(() => new ContractNegotiatorEngine(), []);
  const aaEngine = useMemo(() => new AfterCareAllyEngine(), []);
  const uwEngine = useMemo(() => new TheUnwindEngine(), []);

  const [currentStep, setCurrentStep] = useState<WorkflowStep>('boundaries');

  const [boundaries, setBoundaries] = useState<HardLimitBoundary[]>(() =>
    bbEngine.initializeHardLimits(initialChecklistActivities)
  );

  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [scenePlan, setScenePlan] = useState<ScenePlan>(() =>
    spEngine.createBlankScene()
  );

  const [contract, setContract] = useState<NegotiatedContract | null>(null);
  const [aftercarePlan, setAftercarePlan] = useState<AftercarePlan | null>(null);
  const [reflection, setReflection] = useState<ReflectionFramework | null>(null);

  const plannerSuggestions = useMemo(() => {
    return spEngine.processChecklistData(initialChecklistActivities);
  }, [initialChecklistActivities, spEngine]);

  const isContractSafetyValid = useMemo(() => {
    if (!contract) return true;
    return cnEngine.validateContractSafety(contract);
  }, [contract, cnEngine]);

  const handleSaveBoundary = (
    activityId: string,
    updatedFields: Partial<Omit<NSRSentence, 'formattedText'>>
  ) => {
    setBoundaries((prev) =>
      prev.map((b) =>
        b.activityId === activityId ? bbEngine.updateNSRPart(b, updatedFields) : b
      )
    );
  };

  const handleConfirmBoundary = (activityId: string) => {
    setBoundaries((prev) =>
      prev.map((b) =>
        b.activityId === activityId ? { ...b, isConfirmed: !b.isConfirmed } : b
      )
    );
  };

  const handleSelectActivity = (activityId: string) => {
    setSelectedActivityIds((prev) => {
      const isSelected = prev.includes(activityId);
      const nextIds = isSelected
        ? prev.filter((id) => id !== activityId)
        : [...prev, activityId];

      const updatedPlan = { ...scenePlan, selectedSceneActivities: nextIds };
      const finalized = spEngine.finalizeScenePlan(updatedPlan, initialChecklistActivities);

      setScenePlan(finalized);
      return finalized.selectedSceneActivities;
    });
  };

  const handleProceedToNegotiation = () => {
    const activeBoundaries = boundaries.filter((b) => b.isConfirmed);
    const initializedContract = cnEngine.generateContractDraft(scenePlan, activeBoundaries);
    initializedContract.finalizedSequence = selectedActivityIds;
    setContract(initializedContract);
    setCurrentStep('negotiator');
  };

  const handleSignContract = (signature: ParticipantSignature) => {
    if (!contract) return;
    const updatedContract = cnEngine.executeSignature(contract, signature);
    setContract(updatedContract);

    if (updatedContract.isConsensual) {
      const generatedAftercare = aaEngine.generatePlan({
        sceneId: updatedContract.sceneId,
        selectedSceneActivities: updatedContract.finalizedSequence,
        sceneNotes: scenePlan.sceneNotes || ''
      });
      setAftercarePlan(generatedAftercare);
      setCurrentStep('aftercare');
    }
  };

  const handleToggleAftercareTask = (taskId: string) => {
    if (!aftercarePlan) return;
    setAftercarePlan(aaEngine.toggleTaskState(aftercarePlan, taskId));
  };

  const handleUpdateAftercareNotes = (notes: string) => {
    if (!aftercarePlan) return;
    setAftercarePlan({ ...aftercarePlan, customNotes: notes });
  };

  const handleProceedToUnwind = () => {
    if (!contract) return;
    const initializedReflection = uwEngine.initializeReflection({
      sceneId: contract.sceneId,
      selectedSceneActivities: contract.finalizedSequence,
      sceneNotes: scenePlan.sceneNotes || ''
    });
    setReflection(initializedReflection);
    setCurrentStep('unwind');
  };

  const handleUpdateReflectionMetrics = (metrics: Partial<ReflectionMetrics>) => {
    if (!reflection) return;
    setReflection(uwEngine.updateMetrics(reflection, metrics));
  };

  const handleUpdateReflectionText = (
    fields: Partial<Pick<ReflectionFramework, 'keyTakeaways' | 'whatWentWell' | 'growthOpportunities'>>
  ) => {
    if (!reflection) return;
    setReflection({ ...reflection, ...fields });
  };

  const handleToggleReflectionShare = () => {
    if (!reflection) return;
    setReflection({ ...reflection, hasSharedWithPartner: !reflection.hasSharedWithPartner });
  };

  return (
    <div style={{ padding: '40px 20px', maxWidth: '950px', margin: '0 auto', fontFamily: 'var(--font-ui)' }}>
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '32px',
        borderBottom: '1px solid #E4E7EB',
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        {(['boundaries', 'planner', 'negotiator', 'aftercare', 'unwind'] as WorkflowStep[]).map((step, idx) => {
          const isActive = currentStep === step;
          const label = ['Boundaries', 'Scene Planner', 'Negotiator', 'Aftercare', 'The Unwind'][idx];
          const stepColor = isActive ? 'var(--indigo)' : 'var(--amethyst-smoke)';

          return (
            <button
              key={step}
              onClick={() => {
                if (step === 'negotiator' && !contract) return;
                if (step === 'aftercare' && !aftercarePlan) return;
                if (step === 'unwind' && !reflection) return;
                setCurrentStep(step);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: isActive ? `3px solid ${stepColor}` : '3px solid transparent',
                color: stepColor,
                fontWeight: isActive ? 'bold' : 'normal',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap'
              }}
            >
              {idx + 1}. {label}
            </button>
          );
        })}
      </nav>

      <main style={{ minHeight: '400px', marginBottom: '24px' }}>
        {currentStep === 'boundaries' && (
          <div>
            <HardLimitNSRView
              boundaries={boundaries}
              onSaveBoundary={handleSaveBoundary}
              onConfirmBoundary={handleConfirmBoundary}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={() => setCurrentStep('planner')}
                style={{
                  fontFamily: 'var(--font-ui)',
                  padding: '12px 32px',
                  backgroundColor: 'var(--indigo)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Proceed to Scene Planner →
              </button>
            </div>
          </div>
        )}

        {currentStep === 'planner' && (
          <div>
            <ChecklistAssistedView
              suggestions={plannerSuggestions}
              selectedActivityIds={selectedActivityIds}
              onSelectActivity={handleSelectActivity}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button
                onClick={() => setCurrentStep('boundaries')}
                style={{ background: 'transparent', border: '1px solid #D0D5DD', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer' }}
              >
                ← Back
              </button>
              <button
                onClick={handleProceedToNegotiation}
                disabled={selectedActivityIds.length === 0}
                style={{
                  fontFamily: 'var(--font-ui)',
                  padding: '12px 32px',
                  backgroundColor: selectedActivityIds.length === 0 ? '#D0D5DD' : 'var(--indigo)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: selectedActivityIds.length === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                Build Agreement Draft →
              </button>
            </div>
          </div>
        )}

        {currentStep === 'negotiator' && contract && (
          <ConsentHandshakeView
            contract={contract}
            isSafetyValid={isContractSafetyValid}
            currentUserId={currentUserId}
            onSignContract={handleSignContract}
          />
        )}

        {currentStep === 'aftercare' && aftercarePlan && (
          <div>
            <AftercareDashboardView
              plan={aftercarePlan}
              onToggleTask={handleToggleAftercareTask}
              onUpdateNotes={handleUpdateAftercareNotes}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button
                onClick={handleProceedToUnwind}
                style={{
                  fontFamily: 'var(--font-ui)',
                  padding: '12px 32px',
                  backgroundColor: 'var(--indigo)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Enter Self-Reflection (The Unwind) →
              </button>
            </div>
          </div>
        )}

        {currentStep === 'unwind' && reflection && (
          <ReflectionView
            framework={reflection}
            onUpdateMetrics={handleUpdateReflectionMetrics}
            onUpdateText={handleUpdateReflectionText}
            onToggleShare={handleToggleReflectionShare}
          />
        )}
      </main>
    </div>
  );
};
