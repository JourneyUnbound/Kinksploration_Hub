import React, { useState } from 'react';
import '../../styles/brandVariables.css';
import { ChecklistActivity, ChecklistSuggestions } from '../../types/scenePlanner';

interface ChecklistAssistedViewProps {
  suggestions: ChecklistSuggestions;
  onSelectActivity: (activityId: string) => void;
  selectedActivityIds: string[];
}

export const ChecklistAssistedView: React.FC<ChecklistAssistedViewProps> = ({
  suggestions,
  onSelectActivity,
  selectedActivityIds
}) => {
  const [activeTab, setActiveTab] = useState<'prioritized' | 'discussion'>('prioritized');

  return (
    <div className="scene-planner-container" style={{
      fontFamily: 'var(--font-ui)',
      color: 'var(--deep-twilight)',
      backgroundColor: '#FAFAFB',
      padding: '32px',
      borderRadius: '12px',
      maxWidth: '850px',
      margin: '0 auto'
    }}>
      <header style={{
        background: 'linear-gradient(135deg, var(--ocean-mist) 0%, var(--bondi-blue) 50%, var(--cotton-candy) 100%)',
        padding: '24px 32px',
        borderRadius: '12px 12px 0 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-header)',
            color: '#FFFFFF',
            margin: 0,
            fontSize: '28px',
            fontWeight: 'normal',
            textShadow: '0 1px 3px rgba(18, 15, 115, 0.2)'
          }}>
            Scene Planner
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#FFFFFF', opacity: 0.9, fontSize: '14px' }}>
            Kinksploration™ Hub Powered Integration
          </p>
        </div>
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}>
          <circle cx="35" cy="40" r="8" fill="#FFFFFF" />
          <path d="M20 80 C20 55, 50 55, 50 80" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          <circle cx="65" cy="35" r="8" fill="#FFFFFF" />
          <path d="M50 75 C50 50, 80 50, 80 75" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          <path d="M35 55 Q50 45 65 52" stroke="var(--cotton-candy)" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </header>

      <div style={{
        display: 'flex',
        gap: '12px',
        backgroundColor: '#FFFFFF',
        padding: '16px 24px',
        borderLeft: '1px solid #E4E7EB',
        borderRight: '1px solid #E4E7EB',
      }}>
        <button
          onClick={() => setActiveTab('prioritized')}
          style={{
            fontFamily: 'var(--font-ui)',
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: activeTab === 'prioritized' ? 'var(--indigo)' : '#F0F2F5',
            color: activeTab === 'prioritized' ? '#FFFFFF' : 'var(--deep-twilight)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Prioritized Intentions ({suggestions.suggestedActivities.length})
        </button>
        <button
          onClick={() => setActiveTab('discussion')}
          style={{
            fontFamily: 'var(--font-ui)',
            padding: '10px 20px',
            borderRadius: '24px',
            border: 'none',
            backgroundColor: activeTab === 'discussion' ? 'var(--blaze-orange)' : '#F0F2F5',
            color: activeTab === 'discussion' ? '#FFFFFF' : 'var(--deep-twilight)',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Exploration & Boundaries ({suggestions.discussionOpportunities.length})
        </button>
      </div>

      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E7EB',
        borderRadius: '0 0 12px 12px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(18, 15, 115, 0.03)'
      }}>
        {activeTab === 'prioritized' ? (
          <div>
            <h3 style={{ fontFamily: 'var(--font-header)', margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'normal' }}>
              High Resonance Elements
            </h3>
            <p style={{ color: 'var(--deep-twilight)', opacity: 0.7, fontSize: '14px', marginBottom: '24px' }}>
              These elements carry <strong>4★ and 5★</strong> valuations. Ready to transition cleanly into active configurations.
            </p>
            {suggestions.suggestedActivities.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--amethyst-smoke)' }}>No highly prioritized prompts verified.</p>
            ) : (
              suggestions.suggestedActivities.map(activity => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  isSelected={selectedActivityIds.includes(activity.id)}
                  onSelect={onSelectActivity}
                  statusColor="var(--ocean-mist)"
                  statusText={`${activity.rating}★ Match`}
                />
              ))
            )}
          </div>
        ) : (
          <div>
            <h3 style={{ fontFamily: 'var(--font-header)', margin: '0 0 8px 0', fontSize: '20px', fontWeight: 'normal' }}>
              Exploration Frameworks
            </h3>
            <p style={{ color: 'var(--deep-twilight)', opacity: 0.7, fontSize: '14px', marginBottom: '24px' }}>
              Identified <strong>Soft Limits</strong> or items within <strong>2★–3★</strong> vectors. Designed to surface communication checkpoints.
            </p>
            {suggestions.discussionOpportunities.length === 0 ? (
              <p style={{ fontStyle: 'italic', color: 'var(--amethyst-smoke)' }}>No complex items flag profiles detected.</p>
            ) : (
              suggestions.discussionOpportunities.map(activity => (
                <ActivityRow
                  key={activity.id}
                  activity={activity}
                  isSelected={selectedActivityIds.includes(activity.id)}
                  onSelect={onSelectActivity}
                  statusColor={activity.isSoftLimit ? 'var(--blaze-orange)' : 'var(--bondi-blue)'}
                  statusText={activity.isSoftLimit ? 'Soft Limit' : 'Exploratory'}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const ActivityRow: React.FC<{
  activity: ChecklistActivity;
  isSelected: boolean;
  onSelect: (id: string) => void;
  statusColor: string;
  statusText: string;
}> = ({ activity, isSelected, onSelect, statusColor, statusText }) => {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 20px',
      borderBottom: '1px solid #F0F2F5',
      backgroundColor: isSelected ? 'rgba(232, 160, 168, 0.08)' : 'transparent',
      transition: 'background-color 0.2s ease',
      borderRadius: '6px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span style={{
          color: 'var(--deep-twilight)',
          fontWeight: '600',
          fontSize: '15px'
        }}>
          {activity.name}
        </span>
        <span style={{
          backgroundColor: statusColor,
          color: '#FFFFFF',
          fontSize: '11px',
          padding: '3px 10px',
          borderRadius: '12px',
          fontWeight: '600',
          letterSpacing: '0.3px'
        }}>
          {statusText}
        </span>
      </div>

      <button
        onClick={() => onSelect(activity.id)}
        style={{
          fontFamily: 'var(--font-ui)',
          padding: '8px 18px',
          borderRadius: '6px',
          border: `1px solid ${isSelected ? 'var(--indigo)' : '#D0D5DD'}`,
          backgroundColor: isSelected ? 'var(--indigo)' : '#FFFFFF',
          color: isSelected ? '#FFFFFF' : 'var(--deep-twilight)',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '600',
          transition: 'all 0.15s ease'
        }}
      >
        {isSelected ? '✓ In Scene Plan' : 'Add to Plan'}
      </button>
    </div>
  );
};
