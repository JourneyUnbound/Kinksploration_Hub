'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import '@/styles/brandVariables.css';

import type { ChecklistActivity, ScenePlan } from '@/types/scenePlanner';
import type { HardLimitBoundary, NSRSentence } from '@/types/boundaryBuilder';
import type { NegotiatedContract, ParticipantSignature } from '@/types/contractNegotiator';
import type { AftercarePlan } from '@/types/AfterCareAlly';
import type { ReflectionFramework, ReflectionMetrics } from '@/types/theUnwind';

import { BoundaryBuilderEngine } from '@/engines/BoundaryBuilderEngine';
import { ScenePlannerEngine } from '@/engines/ScenePlannerEngine';
import { ContractNegotiatorEngine } from '@/engines/ContractNegotiatorEngine';
import { AfterCareAllyEngine } from '@/engines/AfterCareAllyEngine';
import { TheUnwindEngine } from '@/engines/TheUnwindEngine';
import { KinksplorationStorage } from '@/lib/local-storage';

import { HardLimitNSRView } from '@/components/BoundaryBuilder/HardLimitNSRView';
import { ChecklistAssistedView } from '@/components/ScenePlanner/ChecklistAssistedView';
import { ContractNegotiatorView } from '@/components/ContractNegotiator/ContractNegotiatorView';
import { AftercareDashboardView } from '@/components/AftercareAlly/AftercareDashboardView';
import { ReflectionView } from '@/components/TheUnwind/ReflectionView';

type ToolId = 'boundaries' | 'planner' | 'negotiator' | 'aftercare' | 'unwind';

type ToolMode = 'standalone' | 'with_checklist' | 'with_prior_tools';

interface KinksplorationHubProps {
  initialChecklistActivities: ChecklistActivity[];
  currentUserId: string;
}

const toolLabels: Record<ToolId, string> = {
  boundaries: 'Boundary Builder',
  planner: 'Scene Planner',
  negotiator: 'Contract Negotiator',
  aftercare: 'AfterCare Ally',
  unwind: 'The Unwind',
};

export const KinksplorationHub: React.FC<KinksplorationHubProps> = ({
  initialChecklistActivities,
  currentUserId,
}) => {
  const bbEngine = useMemo(() => new BoundaryBuilderEngine(), []);
  const spEngine = useMemo(() => new ScenePlannerEngine(), []);
  const cnEngine = useMemo(() => new ContractNegotiatorEngine(), []);
  const aaEngine = useMemo(() => new AfterCareAllyEngine(), []);
  const uwEngine = useMemo(() => new TheUnwindEngine(), []);

  const [activeTool, setActiveTool] = useState<ToolId>('boundaries');
  const [checklistActivities, setChecklistActivities] = useState<ChecklistActivity[]>([]);
  const [boundaries, setBoundaries] = useState<HardLimitBoundary[]>([]);
  const [manualActivities, setManualActivities] = useState<ChecklistActivity[]>([]);
  const [manualActivityName, setManualActivityName] = useState('');
  const [manualBoundaryName, setManualBoundaryName] = useState('');
  const [selectedActivityIds, setSelectedActivityIds] = useState<string[]>([]);
  const [scenePlan, setScenePlan] = useState<ScenePlan>(() => spEngine.createBlankScene());
  const [contract, setContract] = useState<NegotiatedContract | null>(null);
  const [aftercarePlan, setAftercarePlan] = useState<AftercarePlan | null>(null);
  const [reflection, setReflection] = useState<ReflectionFramework | null>(null);

  useEffect(() => {
    const responses = KinksplorationStorage.getChecklistResponses();
    const byId = new Map(responses.map((response) => [response.activityId, response]));

    const answeredActivities = initialChecklistActivities
      .map((activity) => {
        const response = byId.get(activity.id);
        if (!response) return null;
        const rating = Math.min(5, Math.max(1, response.ratingStars || 1)) as ChecklistActivity['rating'];
        return {
          ...activity,
          rating,
          isHardLimit: response.isHardLimit,
          isSoftLimit: response.isSoftLimit,
        };
      })
      .filter((activity): activity is ChecklistActivity => activity !== null);

    setChecklistActivities(answeredActivities);
    setBoundaries([
      ...bbEngine.initializeHardLimits(answeredActivities),
      ...bbEngine.initializeSoftLimits(answeredActivities),
    ]);
  }, [bbEngine, initialChecklistActivities]);

  const allAvailableActivities = useMemo(
    () => [...checklistActivities, ...manualActivities],
    [checklistActivities, manualActivities]
  );

  const plannerSuggestions = useMemo(
    () => spEngine.processChecklistData(allAvailableActivities),
    [allAvailableActivities, spEngine]
  );

  const modeFor = (tool: ToolId): ToolMode => {
    if (tool === 'boundaries') return checklistActivities.length > 0 ? 'with_checklist' : 'standalone';
    if (tool === 'planner') {
      if (checklistActivities.length > 0) return 'with_checklist';
      return boundaries.length > 0 ? 'with_prior_tools' : 'standalone';
    }
    if (tool === 'negotiator') return scenePlan.selectedSceneActivities.length > 0 || boundaries.length > 0 ? 'with_prior_tools' : 'standalone';
    if (tool === 'aftercare') return contract || scenePlan.selectedSceneActivities.length > 0 ? 'with_prior_tools' : 'standalone';
    return contract || aftercarePlan ? 'with_prior_tools' : 'standalone';
  };

  const openTool = (tool: ToolId) => {
    if (tool === 'negotiator' && !contract) {
      const activeBoundaries = boundaries.filter((boundary) => boundary.isConfirmed);
      setContract(
        scenePlan.selectedSceneActivities.length > 0 || activeBoundaries.length > 0
          ? cnEngine.generateContractDraft(scenePlan, activeBoundaries)
          : cnEngine.createBlankContract()
      );
    }

    if (tool === 'aftercare' && !aftercarePlan) {
      setAftercarePlan(
        scenePlan.selectedSceneActivities.length > 0
          ? aaEngine.generatePlan({
              sceneId: scenePlan.id,
              selectedSceneActivities: scenePlan.selectedSceneActivities,
              sceneNotes: scenePlan.sceneNotes,
            })
          : aaEngine.generatePlan({
              sceneId: crypto.randomUUID(),
              selectedSceneActivities: [],
              sceneNotes: '',
            })
      );
    }

    if (tool === 'unwind' && !reflection) {
      setReflection(
        contract || scenePlan.selectedSceneActivities.length > 0
          ? uwEngine.initializeReflection({
              sceneId: contract?.sceneId ?? scenePlan.id,
              selectedSceneActivities: contract?.finalizedSequence ?? scenePlan.selectedSceneActivities,
              sceneNotes: scenePlan.sceneNotes,
            })
          : uwEngine.initializeReflection({
              sceneId: crypto.randomUUID(),
              selectedSceneActivities: [],
              sceneNotes: '',
            })
      );
    }

    setActiveTool(tool);
  };

  const handleSaveBoundary = (
    activityId: string,
    updatedFields: Partial<Omit<NSRSentence, 'formattedText'>>
  ) => {
    setBoundaries((current) =>
      current.map((boundary) =>
        boundary.activityId === activityId
          ? bbEngine.updateNSRPart(boundary, updatedFields)
          : boundary
      )
    );
  };

  const handleConfirmBoundary = (activityId: string) => {
    setBoundaries((current) =>
      current.map((boundary) =>
        boundary.activityId === activityId
          ? { ...boundary, isConfirmed: !boundary.isConfirmed }
          : boundary
      )
    );
  };

  const addManualBoundary = (boundaryType: 'hard' | 'soft') => {
    const name = manualBoundaryName.trim();
    if (!name) return;
    const activityId = `manual-boundary-${Date.now()}`;
    setBoundaries((current) => [
      ...current,
      {
        activityId,
        activityName: name,
        boundaryType,
        isConfirmed: false,
        nsrScript: {
          need: '',
          situation: name,
          request:
            boundaryType === 'hard'
              ? 'this activity is completely off-limits and non-negotiable'
              : 'we discuss this activity and agree on the conditions before including it',
          formattedText: '',
        },
      },
    ]);
    setManualBoundaryName('');
  };

  const addManualActivity = () => {
    const name = manualActivityName.trim();
    if (!name) return;
    const activity: ChecklistActivity = {
      id: `manual-activity-${Date.now()}`,
      name,
      rating: 3,
      isHardLimit: false,
      isSoftLimit: false,
    };
    setManualActivities((current) => [...current, activity]);
    setManualActivityName('');
  };

  const handleSelectActivity = (activityId: string) => {
    setSelectedActivityIds((current) => {
      const next = current.includes(activityId)
        ? current.filter((id) => id !== activityId)
        : [...current, activityId];
      const finalized = spEngine.finalizeScenePlan(
        { ...scenePlan, selectedSceneActivities: next, sceneSequence: next },
        allAvailableActivities
      );
      setScenePlan(finalized);
      return finalized.selectedSceneActivities;
    });
  };

  const handleSignContract = (signature: ParticipantSignature) => {
    if (!contract) return;
    setContract(cnEngine.executeSignature(contract, signature));
  };

  const handleUpdateReflectionMetrics = (metrics: Partial<ReflectionMetrics>) => {
    if (reflection) setReflection(uwEngine.updateMetrics(reflection, metrics));
  };

  return (
    <div style={{ padding: '32px 20px', maxWidth: 1000, margin: '0 auto', fontFamily: 'var(--font-ui)' }}>
      <header style={{ marginBottom: 24 }}>
        <h1 style={{ marginBottom: 6, fontFamily: 'var(--font-header)', color: 'var(--deep-twilight)' }}>
          Journey Unbound™ Kinksploration™ Hub
        </h1>
        <p style={{ marginTop: 0, color: 'var(--amethyst-smoke)' }}>
          Open any tool at any time. Available context is used when present and never required.
        </p>
        <Link href="/checklist" style={{ color: 'var(--indigo)', fontWeight: 600 }}>
          Open Kinksploration™ Checklist
        </Link>
      </header>

      <nav style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 28 }}>
        {(Object.keys(toolLabels) as ToolId[]).map((tool) => {
          const active = activeTool === tool;
          return (
            <button
              key={tool}
              onClick={() => openTool(tool)}
              style={{
                padding: '12px 14px',
                borderRadius: 8,
                border: active ? '2px solid var(--indigo)' : '1px solid #D0D5DD',
                background: active ? 'rgba(75, 55, 145, 0.08)' : '#fff',
                color: 'var(--deep-twilight)',
                cursor: 'pointer',
                fontWeight: active ? 700 : 600,
              }}
            >
              {toolLabels[tool]}
              <span style={{ display: 'block', marginTop: 4, fontSize: 11, fontWeight: 400, color: 'var(--amethyst-smoke)' }}>
                {modeFor(tool)}
              </span>
            </button>
          );
        })}
      </nav>

      {activeTool === 'boundaries' && (
        <>
          <HardLimitNSRView
            boundaries={boundaries}
            onSaveBoundary={handleSaveBoundary}
            onConfirmBoundary={handleConfirmBoundary}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <input
              value={manualBoundaryName}
              onChange={(event) => setManualBoundaryName(event.target.value)}
              placeholder="Add a boundary without checklist data"
              style={{ flex: 1, minWidth: 240, padding: 10, border: '1px solid #D0D5DD', borderRadius: 6 }}
            />
            <button onClick={() => addManualBoundary('hard')}>Add Hard Boundary</button>
            <button onClick={() => addManualBoundary('soft')}>Add Soft Boundary</button>
          </div>
        </>
      )}

      {activeTool === 'planner' && (
        <>
          <ChecklistAssistedView
            suggestions={plannerSuggestions}
            selectedActivityIds={selectedActivityIds}
            onSelectActivity={handleSelectActivity}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <input
              value={manualActivityName}
              onChange={(event) => setManualActivityName(event.target.value)}
              placeholder="Add an activity directly to the planner"
              style={{ flex: 1, padding: 10, border: '1px solid #D0D5DD', borderRadius: 6 }}
            />
            <button onClick={addManualActivity}>Add Activity</button>
          </div>
        </>
      )}

      {activeTool === 'negotiator' && contract && (
  <ContractNegotiatorView
    contract={contract}
    onUpdateContract={setContract}
    isSafetyValid={cnEngine.validateContractSafety(contract)}
    currentUserId={currentUserId}
    onSignContract={handleSignContract}
  />
)}

      {activeTool === 'aftercare' && aftercarePlan && (
        <AftercareDashboardView
          plan={aftercarePlan}
          onToggleTask={(taskId) => setAftercarePlan(aaEngine.toggleTaskState(aftercarePlan, taskId))}
          onUpdateNotes={(customNotes) => setAftercarePlan({ ...aftercarePlan, customNotes })}
        />
      )}

      {activeTool === 'unwind' && reflection && (
        <ReflectionView
          framework={reflection}
          onUpdateMetrics={handleUpdateReflectionMetrics}
          onUpdateText={(fields) => setReflection({ ...reflection, ...fields })}
          onToggleShare={() => setReflection({ ...reflection, hasSharedWithPartner: !reflection.hasSharedWithPartner })}
        />
      )}
    </div>
  );
};
