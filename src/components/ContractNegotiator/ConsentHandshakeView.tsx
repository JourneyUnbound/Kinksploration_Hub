'use client';
import React, { useState } from 'react';
import '../../styles/brandVariables.css';
import { NegotiatedContract, ParticipantSignature } from '../../types/contractNegotiator';

interface ConsentHandshakeViewProps {
  contract: NegotiatedContract;
  isSafetyValid: boolean;
  currentUserId: string;
  onSignContract: (signature: ParticipantSignature) => void;
}

export const ConsentHandshakeView: React.FC<ConsentHandshakeViewProps> = ({
  contract,
  isSafetyValid,
  currentUserId,
  onSignContract
}) => {
  const [hasCheckedTerms, setHasCheckedTerms] = useState(false);

  const userHasSigned = contract.signatures.some(sig => sig.participantId === currentUserId);

  const handleSignClick = () => {
    if (!hasCheckedTerms || !isSafetyValid) return;
    onSignContract({
      participantId: currentUserId,
      signedAt: new Date().toISOString()
    });
  };

  return (
    <div className="contract-negotiator-container" style={{
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
            fontWeight: 'normal'
          }}>
            Contract Negotiator
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#FFFFFF', opacity: 0.9, fontSize: '14px' }}>
            Multi-Participant Consent Handshake
          </p>
        </div>
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}>
          <path d="M50 15 L80 25 V55 C80 75, 50 85, 50 85 C50 85, 20 75, 20 55 V25 L50 15 Z" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <path d="M35 50 L45 60 L65 40" stroke="var(--cotton-candy)" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
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
        gap: '24px'
      }}>
        {!isSafetyValid ? (
          <div style={{
            backgroundColor: 'rgba(189, 21, 21, 0.06)',
            borderLeft: '4px solid var(--brick-ember)',
            padding: '16px',
            borderRadius: '4px'
          }}>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--brick-ember)', fontWeight: 'bold' }}>Conflict Detected</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              An activity currently mapped inside the scene timeline conflicts directly with a locked Hard Limit boundary. Signatures are disabled until resolved.
            </p>
          </div>
        ) : contract.isConsensual ? (
          <div style={{
            backgroundColor: 'rgba(20, 184, 166, 0.08)',
            borderLeft: '4px solid var(--ocean-mist)',
            padding: '16px',
            borderRadius: '4px'
          }}>
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--ocean-mist)', fontWeight: 'bold' }}>Agreement Activated</h4>
            <p style={{ margin: 0, fontSize: '14px' }}>
              All essential participant signatures are locked and verified. Consent validation is fully confirmed.
            </p>
          </div>
        ) : null}

        <div>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: 'normal', margin: '0 0 12px 0' }}>
            Locked Boundary Protocols
          </h3>
          {contract.lockedHardLimits.length === 0 ? (
            <p style={{ fontStyle: 'italic', color: 'var(--amethyst-smoke)', fontSize: '14px' }}>No locked Hard Limits registered for this transaction.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {contract.lockedHardLimits.map(b => (
                <div key={b.activityId} style={{
                  backgroundColor: '#FDF8F8',
                  borderLeft: '4px solid var(--brick-ember)',
                  padding: '12px 16px',
                  borderRadius: '0 6px 6px 0'
                }}>
                  <strong style={{ display: 'block', fontSize: '14px', color: 'var(--brick-ember)', marginBottom: '4px' }}>
                    {b.activityName} — Non-Negotiable Limit
                  </strong>
                  <p style={{ margin: 0, fontSize: '14px', fontStyle: 'italic', color: 'var(--deep-twilight)' }}>
                    "{b.nsrScript.formattedText}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid #E4E7EB', margin: 0 }} />

        <div>
          <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: 'normal', margin: '0 0 12px 0' }}>
            Signature Matrix
          </h3>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{
              flex: '1',
              minWidth: '200px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #E4E7EB',
              backgroundColor: userHasSigned ? 'rgba(20, 184, 166, 0.04)' : '#FFFFFF',
              textAlign: 'center'
            }}>
              <span style={{ display: 'block', fontSize: '13px', color: 'var(--amethyst-smoke)', fontWeight: 'bold' }}>YOU</span>
              <p style={{ margin: '8px 0', fontSize: '15px', fontWeight: '600' }}>
                {userHasSigned ? '✓ Verified Autograph' : 'Awaiting Authorization'}
              </p>
              {userHasSigned && (
                <span style={{ fontSize: '11px', color: 'var(--ocean-mist)' }}>
                  {new Date(contract.signatures.find(s => s.participantId === currentUserId)?.signedAt || '').toLocaleTimeString()}
                </span>
              )}
            </div>

            <div style={{
              flex: '1',
              minWidth: '200px',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #E4E7EB',
              backgroundColor: contract.signatures.length > (userHasSigned ? 1 : 0) ? 'rgba(20, 184, 166, 0.04)' : '#FFFFFF',
              textAlign: 'center'
            }}>
              <span style={{ display: 'block', fontSize: '13px', color: 'var(--amethyst-smoke)', fontWeight: 'bold' }}>PARTNER</span>
              <p style={{ margin: '8px 0', fontSize: '15px', fontWeight: '600' }}>
                {contract.signatures.some(s => s.participantId !== currentUserId) ? '✓ Verified Autograph' : 'Awaiting Authorization'}
              </p>
            </div>
          </div>
        </div>

        {!userHasSigned && (
          <div style={{
            marginTop: '12px',
            backgroundColor: '#F8F9FA',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #E4E7EB'
          }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hasCheckedTerms}
                onChange={(e) => setHasCheckedTerms(e.target.checked)}
                disabled={!isSafetyValid}
                style={{ marginTop: '3px', accentColor: 'var(--indigo)' }}
              />
              <span style={{ fontSize: '14px', lineHeight: '1.4' }}>
                I acknowledge that I have thoroughly verified the scene configurations, that my personal hard limit frameworks are correctly preserved, and that I consent to this structure.
              </span>
            </label>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={handleSignClick}
                disabled={!hasCheckedTerms || !isSafetyValid}
                style={{
                  fontFamily: 'var(--font-ui)',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: (!hasCheckedTerms || !isSafetyValid) ? '#D0D5DD' : 'var(--indigo)',
                  color: '#FFFFFF',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: (!hasCheckedTerms || !isSafetyValid) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.2s ease'
                }}
              >
                Execute Consent Sign-Off
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
