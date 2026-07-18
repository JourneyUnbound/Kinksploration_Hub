import React from 'react';
import '../../styles/brandVariables.css';
import { ReflectionFramework, ReflectionMetrics } from '../../types/theUnwind';

interface ReflectionViewProps {
  framework: ReflectionFramework;
  onUpdateMetrics: (metrics: Partial<ReflectionMetrics>) => void;
  onUpdateText: (fields: Partial<Pick<ReflectionFramework, 'keyTakeaways' | 'whatWentWell' | 'growthOpportunities'>>) => void;
  onToggleShare: () => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  framework,
  onUpdateMetrics,
  onUpdateText,import React from 'react';
import '../../styles/brandVariables.css';
import { ReflectionFramework, ReflectionMetrics } from '../../types/theUnwind';

interface ReflectionViewProps {
  framework: ReflectionFramework;
  onUpdateMetrics: (metrics: Partial<ReflectionMetrics>) => void;
  onUpdateText: (fields: Partial<Pick<ReflectionFramework, 'keyTakeaways' | 'whatWentWell' | 'growthOpportunities'>>) => void;
  onToggleShare: () => void;
}

export const ReflectionView: React.FC<ReflectionViewProps> = ({
  framework,
  onUpdateMetrics,
  onUpdateText,
  onToggleShare
}) => {
  return (
    <div className="unwind-container" style={{
      fontFamily: 'var(--font-ui)',
      color: 'var(--deep-twilight)',
      backgroundColor: '#FAFAFB',
      padding: '32px',
      borderRadius: '12px',
      maxWidth: '850px',
      margin: '0 auto'
    }}>
      <header style={{
        background: 'linear-gradient(135deg, var(--indigo) 0%, var(--deep-lilac) 50%, var(--cotton-candy) 100%)',
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
            fontWeight: 'normal'
          }}>
            The Unwind
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#FFFFFF', opacity: 0.9, fontSize: '14px' }}>
            Integration & Post-Scene Reflection Matrix
          </p>
        </div>
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}>
          <path d="M20 70 Q50 30 80 70" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="40" r="6" fill="var(--blaze-orange)" />
          <line x1="15" y1="75" x2="85" y2="75" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      </header>

      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E7EB',
        borderRadius: '0 0 12px 12px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(18, 15, 115, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: 'normal', margin: '0 0 20px 0' }}>
            Integration Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                <span>Boundary Safety & Respect Verification</span>
                <span style={{ color: 'var(--indigo)' }}>{framework.metrics.boundaryRespectScore} / 5</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={framework.metrics.boundaryRespectScore}
                onChange={(e) => onUpdateMetrics({ boundaryRespectScore: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--indigo)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                <span>Communication Clarity Check</span>
                <span style={{ color: 'var(--indigo)' }}>{framework.metrics.communicationClarity} / 5</span>
              </div>
              <input
                type="range" min="1" max="5"
                value={framework.metrics.communicationClarity}
                onChange={(e) => onUpdateMetrics({ communicationClarity: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--indigo)' }}
              />
            </div>
          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E4E7EB', margin: 0 }} />

        <div>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: 'normal', margin: '0 0 16px 0' }}>
            Self-Exploration Integration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                What elements flowed exactly as intended?
              </label>
              <textarea
                value={framework.whatWentWell}
                onChange={(e) => onUpdateText({ whatWentWell: e.target.value })}
                style={{ width: '100%', fontFamily: 'var(--font-ui)', padding: '12px', borderRadius: '6px', border: '1px solid #D0D5DD', minHeight: '80px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Key emotional takeaways or internal insights:
              </label>
              <textarea
                value={framework.keyTakeaways}
                onChange={(e) => onUpdateText({ keyTakeaways: e.target.value })}
                style={{ width: '100%', fontFamily: 'var(--font-ui)', padding: '12px', borderRadius: '6px', border: '1px solid #D0D5DD', minHeight: '80px', boxSizing: 'border-box' }}
              />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#F8F9FA',
          padding: '20px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          border: '1px solid #E4E7EB'
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '15px' }}>Partner Visibility Toggle</strong>
            <span style={{ fontSize: '13px', color: 'var(--amethyst-smoke)' }}>
              Keep this reflection private to your personal dashboard or share to sync growth tracks.
            </span>
          </div>
          <button
            onClick={onToggleShare}
            style={{
              fontFamily: 'var(--font-ui)',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: framework.hasSharedWithPartner ? 'var(--ocean-mist)' : 'var(--deep-twilight)',
              color: '#FFFFFF',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            {framework.hasSharedWithPartner ? 'Shared with Partner' : 'Keep Private'}
          </button>
        </div>
      </div>
    </div>
  );
};

  onToggleShare
}) => {
  return (
    <div className="unwind-container" style={{
      fontFamily: 'var(--font-ui)',
      color: 'var(--deep-twilight)',
      backgroundColor: '#FAFAFB',
      padding: '32px',
      borderRadius: '12px',
      maxWidth: '850px',
      margin: '0 auto'
    }}>
      {/* Ocean to Sunset Logo Concept - Shifting to a deeper tone representing reflection[cite: 3] */}
      <header style={{
        background: 'linear-gradient(135deg, var(--indigo) 0%, var(--deep-lilac) 50%, var(--cotton-candy) 100%)',
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
            fontWeight: 'normal'
          }}>
            The Unwind
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#FFFFFF', opacity: 0.9, fontSize: '14px' }}>
            Integration & Post-Scene Reflection Matrix
          </p>
        </div>

        {/* Identity SVG Asset: The Unwind (Sunset Fire energy structure)[cite: 3] */}
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}>
          <path d="M20 70 Q50 30 80 70" stroke="#FFFFFF" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="40" r="6" fill="var(--blaze-orange)" />
          <line x1="15" y1="75" x2="85" y2="75" stroke="#FFFFFF" strokeWidth="3" />
        </svg>
      </header>

      {/* Main Workspace Body Wrapper */}
      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E7EB',
        borderRadius: '0 0 12px 12px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(18, 15, 115, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        gap: '28px'
      }}>

        {/* Section 1: Quantitative Metric Sliders */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: 'normal', margin: '0 0 20px 0' }}>
            Integration Metrics
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                <span>Boundary Safety & Respect Verification</span>
                <span style={{ color: 'var(--indigo)' }}>{framework.metrics.boundaryRespectScore} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={framework.metrics.boundaryRespectScore}
                onChange={(e) => onUpdateMetrics({ boundaryRespectScore: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--indigo)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: '600', marginBottom: '8px' }}>
                <span>Communication Clarity Check</span>
                <span style={{ color: 'var(--indigo)' }}>{framework.metrics.communicationClarity} / 5</span>
              </div>
              <input 
                type="range" min="1" max="5" 
                value={framework.metrics.communicationClarity}
                onChange={(e) => onUpdateMetrics({ communicationClarity: parseInt(e.target.value) })}
                style={{ width: '100%', accentColor: 'var(--indigo)' }}
              />
            </div>

          </div>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E4E7EB', margin: 0 }} />

        {/* Section 2: Qualitative Self-Exploration Inputs[cite: 2] */}
        <div>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: 'normal', margin: '0 0 16px 0' }}>
            Self-Exploration Integration
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                What elements flowed exactly as intended?
              </label>
              <textarea
                value={framework.whatWentWell}
                onChange={(e) => onUpdateText({ whatWentWell: e.target.value })}
                style={{ width: '100%', fontFamily: 'var(--font-ui)', padding: '12px', borderRadius: '6px', border: '1px solid #D0D5DD', minHeight: '80px', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px' }}>
                Key emotional takeaways or internal insights:
              </label>
              <textarea
                value={framework.keyTakeaways}
                onChange={(e) => onUpdateText({ keyTakeaways: e.target.value })}
                style={{ width: '100%', fontFamily: 'var(--font-ui)', padding: '12px', borderRadius: '6px', border: '1px solid #D0D5DD', minHeight: '80px', boxSizing: 'border-box' }}
              />
            </div>

          </div>
        </div>

        {/* Section 3: Shared Visibility Safeguard */}
        <div style={{
          backgroundColor: '#F8F9FA',
          padding: '20px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '12px',
          border: '1px solid #E4E7EB'
        }}>
          <div>
            <strong style={{ display: 'block', fontSize: '15px' }}>Partner Visibility Toggle</strong>
            <span style={{ fontSize: '13px', color: 'var(--amethyst-smoke)' }}>
              Keep this reflection private to your personal dashboard or share to sync growth tracks.
            </span>
          </div>
          <button
            onClick={onToggleShare}
            style={{
              fontFamily: 'var(--font-ui)',
              padding: '10px 20px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: framework.hasSharedWithPartner ? 'var(--ocean-mist)' : 'var(--deep-twilight)',
              color: '#FFFFFF',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.15s ease'
            }}
          >
            {framework.hasSharedWithPartner ? 'Shared with Partner' : 'Keep Private'}
          </button>
        </div>

      </div>
    </div>
  );
};