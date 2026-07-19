'use client';
// src/components/TheUnwind/ReflectionView.tsx
import React from 'react';
;
import { ReflectionFramework, ReflectionMetrics } from '../../types/theUnwind';

interface ReflectionViewProps {
  framework: ReflectionFramework;
  onUpdateMetrics?: (metrics: Partial<ReflectionMetrics>) => void;
  onUpdateText: (fields: Partial<Pick<ReflectionFramework, 'keyTakeaways' | 'whatWentWell' | 'growthOpportunities'>>) => void;
  onToggleShare: () => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  framework,
  onUpdateMetrics,
  onUpdateText,
  onToggleShare,
}) => {
  const handleTextChange = (
    field: 'keyTakeaways' | 'whatWentWell' | 'growthOpportunities',
    value: string
  ) => {
    onUpdateText({ [field]: value });
  };

  const sContainer: React.CSSProperties = {
    fontFamily: 'var(--font-ui)',
    color: 'var(--deep-twilight)',
    backgroundColor: '#FAFAFB',
    padding: '32px',
    borderRadius: '12px',
    maxWidth: '850px',
    margin: '0 auto',
  };

  const sHeader: React.CSSProperties = {
    background: 'linear-gradient(135deg, var(--ocean-mist) 0%, var(--bondi-blue) 50%, var(--cotton-candy) 100%)',
    padding: '24px 32px',
    borderRadius: '12px 12px 0 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '-32px -32px 24px -32px',
  };

  const sH1: React.CSSProperties = {
    fontFamily: 'var(--font-header)',
    color: '#FFFFFF',
    margin: 0,
    fontSize: '28px',
    fontWeight: 'normal',
  };

  const sHeaderP: React.CSSProperties = {
    margin: '4px 0 0 0',
    color: '#FFFFFF',
    opacity: 0.9,
    fontSize: '14px',
  };

  const sCard: React.CSSProperties = {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E4E7EB',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(18, 15, 115, 0.03)',
  };

  const sCardTitle: React.CSSProperties = {
    fontFamily: 'var(--font-header)',
    fontSize: '20px',
    fontWeight: 'normal',
    margin: '0 0 8px 0',
    color: 'var(--deep-twilight)',
  };

  const sCardSubtitle: React.CSSProperties = {
    color: 'var(--amethyst-smoke)',
    fontSize: '14px',
    margin: '0 0 24px 0',
  };

  const sFieldsWrap: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const sLabel: React.CSSProperties = {
    display: 'block',
    fontWeight: 600,
    fontSize: '13px',
    marginBottom: '6px',
    color: 'var(--indigo)',
  };

  const sTextarea: React.CSSProperties = {
    width: '100%',
    fontFamily: 'var(--font-ui)',
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #D0D5DD',
    minHeight: '80px',
    boxSizing: 'border-box',
    fontSize: '14px',
    color: 'var(--deep-twilight)',
    resize: 'vertical',
    outline: 'none',
  };

  const sShareSection: React.CSSProperties = {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #E4E7EB',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  const sShareTitle: React.CSSProperties = {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--deep-twilight)',
  };

  const sShareDesc: React.CSSProperties = {
    fontSize: '13px',
    color: 'var(--amethyst-smoke)',
    margin: '4px 0 0 0',
  };

  const sToggleBtn = (isOn: boolean): React.CSSProperties => ({
    position: 'relative',
    width: '48px',
    height: '28px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: isOn ? 'var(--ocean-mist)' : '#D0D5DD',
    transition: 'background-color 0.2s ease',
    padding: 0,
  });

  const sToggleKnob = (isOn: boolean): React.CSSProperties => ({
    position: 'absolute',
    top: '2px',
    left: isOn ? '22px' : '2px',
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
    transition: 'left 0.2s ease',
    display: 'block',
  });

  const sMetricsSection: React.CSSProperties = {
    marginTop: '28px',
    paddingTop: '20px',
    borderTop: '1px solid #E4E7EB',
  };

  const sMetricsTitle: React.CSSProperties = {
    fontFamily: 'var(--font-header)',
    fontSize: '18px',
    fontWeight: 'normal',
    margin: '0 0 16px 0',
    color: 'var(--deep-twilight)',
  };

  const sMetricsStack: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  };

  const sMetricRow: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const sRange: React.CSSProperties = {
    flex: 1,
    accentColor: 'var(--indigo)',
  };

  const sRangeValue: React.CSSProperties = {
    minWidth: '24px',
    textAlign: 'center',
    fontWeight: 600,
    color: 'var(--deep-twilight)',
  };

  const sNumberInput: React.CSSProperties = {
    width: '100%',
    fontFamily: 'var(--font-ui)',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #D0D5DD',
    fontSize: '14px',
    color: 'var(--deep-twilight)',
    boxSizing: 'border-box',
  };

  return (
    <div style={sContainer}>
      <header style={sHeader}>
        <div>
          <h1 style={sH1}>The Unwind</h1>
          <p style={sHeaderP}>Post-Scene Reflection & Integration Hub</p>
        </div>
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}>
          <circle cx="50" cy="40" r="15" fill="none" stroke="#FFFFFF" strokeWidth="3" />
          <path d="M35 60 Q50 75 65 60" stroke="var(--cotton-candy)" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="40" r="5" fill="var(--cotton-candy)" />
        </svg>
      </header>

      <div style={sCard}>
        <h3 style={sCardTitle}>Session Reflection</h3>
        <p style={sCardSubtitle}>Capture your thoughts, insights, and growth opportunities from this journey.</p>

        <div style={sFieldsWrap}>
          <div>
            <label htmlFor="what-went-well" style={sLabel}>What Went Well</label>
            <textarea
              id="what-went-well"
              value={framework.whatWentWell || ''}
              onChange={(e) => handleTextChange('whatWentWell', e.target.value)}
              placeholder="What moments stood out positively?"
              rows={4}
              style={sTextarea}
            />
          </div>

          <div>
            <label htmlFor="growth-opportunities" style={sLabel}>Growth Opportunities</label>
            <textarea
              id="growth-opportunities"
              value={framework.growthOpportunities || ''}
              onChange={(e) => handleTextChange('growthOpportunities', e.target.value)}
              placeholder="What could be explored or improved next time?"
              rows={4}
              style={sTextarea}
            />
          </div>

          <div>
            <label htmlFor="key-takeaways" style={sLabel}>Key Takeaways</label>
            <textarea
              id="key-takeaways"
              value={framework.keyTakeaways || ''}
              onChange={(e) => handleTextChange('keyTakeaways', e.target.value)}
              placeholder="What are your main insights or learnings?"
              rows={4}
              style={sTextarea}
            />
          </div>
        </div>

        <div style={sShareSection}>
          <div>
            <span style={sShareTitle}>Share Reflection</span>
            <p style={sShareDesc}>Make this reflection visible to your partner</p>
          </div>

          <button
            type="button"
            onClick={onToggleShare}
            aria-pressed={framework.hasSharedWithPartner}
            style={sToggleBtn(framework.hasSharedWithPartner)}
          >
            <span style={sToggleKnob(framework.hasSharedWithPartner)} />
          </button>
        </div>

        {onUpdateMetrics && (
          <div style={sMetricsSection}>
            <h4 style={sMetricsTitle}>Session Metrics</h4>

            <div style={sMetricsStack}>
              <div>
                <label style={sLabel}>Boundary Respect Score</label>
                <div style={sMetricRow}>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={framework.metrics.boundaryRespectScore}
                    onChange={(e) => onUpdateMetrics({ boundaryRespectScore: parseInt(e.target.value) })}
                    style={sRange}
                  />
                  <span style={sRangeValue}>{framework.metrics.boundaryRespectScore}</span>
                </div>
              </div>

              <div>
                <label style={sLabel}>Communication Clarity</label>
                <div style={sMetricRow}>
                  <input
                    type="range"
                    min={1}
                    max={5}
                    value={framework.metrics.communicationClarity}
                    onChange={(e) => onUpdateMetrics({ communicationClarity: parseInt(e.target.value) })}
                    style={sRange}
                  />
                  <span style={sRangeValue}>{framework.metrics.communicationClarity}</span>
                </div>
              </div>

              <div>
                <label style={sLabel}>Emotional Grounding Time (minutes)</label>
                <input
                  type="number"
                  min={0}
                  value={framework.metrics.emotionalGroundingTime}
                  onChange={(e) => onUpdateMetrics({ emotionalGroundingTime: parseInt(e.target.value) || 0 })}
                  style={sNumberInput}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReflectionView;