'use client';
import React from 'react';
import '../../styles/brandVariables.css';
import { AftercarePlan } from '../../types/AfterCareAlly';

interface AftercareDashboardViewProps {
  plan: AftercarePlan;
  onToggleTask: (taskId: string) => void;
  onUpdateNotes: (notes: string) => void;
}

export const AftercareDashboardView: React.FC<AftercareDashboardViewProps> = ({
  plan,
  onToggleTask,
  onUpdateNotes
}) => {
  return (
    <div className="aftercare-container" style={{
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
            AfterCare Ally
          </h1>
          <p style={{ margin: '4px 0 0 0', color: '#FFFFFF', opacity: 0.9, fontSize: '14px' }}>
            Post-Scene Recovery & Care Integration Hub
          </p>
        </div>
        <svg width="50" height="50" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.15))' }}>
          <path d="M50 20 C60 5, 90 10, 90 40 C90 70, 50 90, 50 90 C50 90, 10 70, 10 40 C10 10, 40 5, 50 20 Z" fill="none" stroke="#FFFFFF" strokeWidth="4" />
          <circle cx="50" cy="45" r="10" fill="var(--cotton-candy)" />
        </svg>
      </header>

      <div style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E7EB',
        borderRadius: '0 0 12px 12px',
        padding: '32px',
        boxShadow: '0 4px 12px rgba(18, 15, 115, 0.03)'
      }}>
        <h3 style={{ fontFamily: 'var(--font-header)', fontSize: '20px', fontWeight: 'normal', margin: '0 0 16px 0' }}>
          Active Recovery Checklist
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {plan.suggestedTasks.map(task => (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #E4E7EB',
                backgroundColor: task.isCompleted ? 'rgba(20, 184, 166, 0.03)' : '#FFFFFF',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '22px',
                height: '22px',
                borderRadius: '4px',
                border: `2px solid ${task.isCompleted ? 'var(--ocean-mist)' : '#D0D5DD'}`,
                backgroundColor: task.isCompleted ? 'var(--ocean-mist)' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFFFFF',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {task.isCompleted && '✓'}
              </div>

              <div style={{ flex: 1 }}>
                <p style={{
                  margin: 0,
                  fontSize: '15px',
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                  color: task.isCompleted ? 'var(--amethyst-smoke)' : 'var(--deep-twilight)',
                  fontWeight: task.isCompleted ? 'normal' : '500'
                }}>
                  {task.taskDescription}
                </p>
                <span style={{
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  fontWeight: 'bold',
                  letterSpacing: '0.5px',
                  color: task.category === 'physical' ? 'var(--blaze-orange)' : 'var(--bondi-blue)',
                  marginTop: '4px',
                  display: 'inline-block'
                }}>
                  {task.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '24px' }}>
          <label style={{ display: 'block', fontFamily: 'var(--font-header)', fontSize: '18px', marginBottom: '8px' }}>
            Real-Time Integration Notes
          </label>
          <textarea
            value={plan.customNotes}
            onChange={(e) => onUpdateNotes(e.target.value)}
            placeholder="Log specific physical updates, personal requests, or track recovery timelines here..."
            style={{
              width: '100%',
              fontFamily: 'var(--font-ui)',
              padding: '14px',
              borderRadius: '6px',
              border: '1px solid #D0D5DD',
              minHeight: '100px',
              boxSizing: 'border-box',
              fontSize: '14px',
              color: 'var(--deep-twilight)'
            }}
          />
        </div>
      </div>
    </div>
  );
};
