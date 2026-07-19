'use client';
import React, { useState } from 'react';
import '../../styles/brandVariables.css';
import { HardLimitBoundary, NSRSentence } from '../../types/boundaryBuilder';

interface HardLimitNSRViewProps {
  boundaries: HardLimitBoundary[];
  onSaveBoundary: (activityId: string, updatedScript: Partial<Omit<NSRSentence, 'formattedText'>>) => void;
  onConfirmBoundary: (activityId: string) => void;
}

export const HardLimitNSRView: React.FC<HardLimitNSRViewProps> = ({
  boundaries,
  onSaveBoundary,
  onConfirmBoundary
}) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  if (boundaries.length === 0) {
    return (
      <div style={{
        fontFamily: 'var(--font-ui)',
        color: 'var(--deep-twilight)',
        textAlign: 'center',
        padding: '40px',
        border: '1px dashed var(--amethyst-smoke)',
        borderRadius: '8px'
      }}>
        <h3 style={{ fontFamily: 'var(--font-header)', fontWeight: 'normal' }}>No Hard Limits Detected</h3>
        <p>No elements were marked as Hard Limits in the checklist phase. You're ready to proceed directly to the Scene Planner!</p>
      </div>
    );
  }

  const currentBoundary = boundaries[activeIndex];

  return (
    <div className="boundary-builder-container" style={{
      fontFamily: 'var(--font-ui)',
      color: 'var(--deep-twilight)',
      backgroundColor: '#FAFAFB',
      padding: '32px',
      borderRadius: '12px',
      maxWidth: '850px',
      margin: '0 auto'
    }}>
      {/* Ocean to Sunset Custom Variant Header */}
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
            fontWeight: 'normal'
          }}>
            Boundary Builder
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#FFFFFF', opacity: 0.9, fontSize: '14px' }}>
            NSR Communication Translation Protocol
          </p>
        </div>

        {/* Boundary Builder Identity Asset (Interlocking rings mapping limits cleanly) */}
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}>
          <circle cx="40" cy="50" r="18" stroke="#FFFFFF" strokeWidth="4" fill="none" />
          <circle cx="60" cy="50" r="18" stroke="var(--cotton-candy)" strokeWidth="4" fill="none" />
          <line x1="25" y1="25" x2="75" y2="75" stroke="var(--brick-ember)" strokeWidth="3" strokeDasharray="4 4" />
        </svg>
      </header>

      {/* Main Grid: Left Side Navigation List, Right Side Workspace Editors */}
      <div style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
        
        {/* Left Column Stack: Selection Queue */}
        <div style={{ width: '30%', display: 'flex', fill: 'none', flexDirection: 'column', gap: '8px' }}>
          {boundaries.map((b, idx) => (
            <button
              key={b.activityId}
              onClick={() => setActiveIndex(idx)}
              style={{
                fontFamily: 'var(--font-ui)',
                textAlign: 'left',
                padding: '12px 16px',
                borderRadius: '6px',
                border: activeIndex === idx ? '1px solid var(--brick-ember)' : '1px solid #E4E7EB',
                backgroundColor: activeIndex === idx ? 'rgba(189, 21, 21, 0.05)' : '#FFFFFF',
                color: activeIndex === idx ? 'var(--brick-ember)' : 'var(--deep-twilight)',
                fontWeight: activeIndex === idx ? '600' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {b.activityName}
                </span>
                {b.isConfirmed && <span style={{ color: 'var(--ocean-mist)', fontWeight: 'bold' }}>✓</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Right Column Stack: NSR Script Builder */}
        <div style={{
          width: '70%',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E4E7EB',
          borderRadius: '8px',
          padding: '24px',
          boxShadow: '0 4px 12px rgba(18, 15, 115, 0.02)'
        }}>
          <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '22px', margin: '0 0 4px 0', fontWeight: 'normal' }}>
            Formulating Script: <span style={{ color: 'var(--brick-ember)', fontWeight: '600' }}>{currentBoundary.activityName}</span>
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--amethyst-smoke)', margin: '0 0 20px 0' }}>
            Constructing context output using standard Need-Situation-Request syntax patterns.
          </p>

          {/* Form Fields Stack */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Element 1: NEED */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: 'var(--indigo)' }}>
                1. Core Need / Value
              </label>
              <textarea
                value={currentBoundary.nsrScript.need}
                onChange={(e) => onSaveBoundary(currentBoundary.activityId, { need: e.target.value })}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-ui)',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #D0D5DD',
                  minHeight: '48px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Element 2: SITUATION */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: 'var(--indigo)' }}>
                2. Situation / Activity Framework
              </label>
              <textarea
                value={currentBoundary.nsrScript.situation}
                onChange={(e) => onSaveBoundary(currentBoundary.activityId, { situation: e.target.value })}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-ui)',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #D0D5DD',
                  minHeight: '48px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Element 3: REQUEST */}
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '13px', marginBottom: '6px', color: 'var(--indigo)' }}>
                3. Actionable Request
              </label>
              <textarea
                value={currentBoundary.nsrScript.request}
                onChange={(e) => onSaveBoundary(currentBoundary.activityId, { request: e.target.value })}
                style={{
                  width: '100%',
                  fontFamily: 'var(--font-ui)',
                  padding: '10px',
                  borderRadius: '6px',
                  border: '1px solid #D0D5DD',
                  minHeight: '48px',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Unified Preview Workspace Panel */}
            <div style={{
              backgroundColor: '#F8F9FA',
              borderLeft: '4px solid var(--brick-ember)',
              padding: '16px',
              borderRadius: '0 8px 8px 0',
              marginTop: '12px'
            }}>
              <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold', color: 'var(--brick-ember)' }}>
                Stitched Script Output
              </span>
              <p style={{
                fontFamily: 'var(--font-header)',
                fontSize: '15px',
                lineHeight: '1.6',
                margin: '8px 0 0 0',
                color: 'var(--deep-twilight)',
                fontStyle: 'italic'
              }}>
                "{currentBoundary.nsrScript.formattedText}"
              </p>
            </div>

            {/* Action Lock Trigger */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                onClick={() => onConfirmBoundary(currentBoundary.activityId)}
                style={{
                  fontFamily: 'var(--font-ui)',
                  padding: '10px 24px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: currentBoundary.isConfirmed ? 'var(--ocean-mist)' : 'var(--deep-twilight)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                {currentBoundary.isConfirmed ? '✓ Statement Verified' : 'Verify & Lock Boundary'}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};