'use client';

import React, { useState } from 'react';
import type {
  NegotiatedContract,
  ParticipantSignature,
} from '@/types/contractNegotiator';

import { ConsentHandshakeView } from './ConsentHandshakeView';

interface ContractNegotiatorViewProps {
  contract: NegotiatedContract;
  onUpdateContract: (contract: NegotiatedContract) => void;
  isSafetyValid: boolean;
  currentUserId: string;
  onSignContract: (signature: ParticipantSignature) => void;
}

export const ContractNegotiatorView: React.FC<ContractNegotiatorViewProps> = ({
  contract,
  onUpdateContract,
  isSafetyValid,
  currentUserId,
  onSignContract,
}) => {
  const [showHandshake, setShowHandshake] = useState(false);

  const updateField = <K extends keyof NegotiatedContract>(
    field: K,
    value: NegotiatedContract[K]
  ) => {
    onUpdateContract({
      ...contract,
      [field]: value,
    });
  };

  const updateStringList = (
    field:
      | 'consentConsiderations'
      | 'negotiatedAgreements'
      | 'agreementClauses',
    index: number,
    value: string
  ) => {
    const next = [...contract[field]];
    next[index] = value;
    updateField(field, next);
  };

  const addStringListItem = (
    field:
      | 'consentConsiderations'
      | 'negotiatedAgreements'
      | 'agreementClauses'
  ) => {
    updateField(field, [...contract[field], '']);
  };

  const removeStringListItem = (
    field:
      | 'consentConsiderations'
      | 'negotiatedAgreements'
      | 'agreementClauses',
    index: number
  ) => {
    updateField(
      field,
      contract[field].filter((_, itemIndex) => itemIndex !== index)
    );
  };

  if (showHandshake) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setShowHandshake(false)}
          style={{ marginBottom: 16 }}
        >
          Back to Contract
        </button>

        <ConsentHandshakeView
          contract={contract}
          isSafetyValid={isSafetyValid}
          currentUserId={currentUserId}
          onSignContract={onSignContract}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 850,
        margin: '0 auto',
        padding: 32,
        backgroundColor: '#FFFFFF',
        border: '1px solid #E4E7EB',
        borderRadius: 12,
        fontFamily: 'var(--font-ui)',
        color: 'var(--deep-twilight)',
      }}
    >
      <h1
        style={{
          marginTop: 0,
          fontFamily: 'var(--font-header)',
          fontWeight: 'normal',
        }}
      >
        Contract Negotiator
      </h1>

      <section style={{ marginBottom: 28 }}>
        <label
          htmlFor="relationship-structure"
          style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}
        >
          Relationship Structure
        </label>

        <input
          id="relationship-structure"
          value={contract.relationshipStructure}
          onChange={(event) =>
            updateField('relationshipStructure', event.target.value)
          }
          placeholder="Describe the relationship or agreement structure"
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 10,
            border: '1px solid #D0D5DD',
            borderRadius: 6,
          }}
        />
      </section>

      <section style={{ marginBottom: 28 }}>
        <label
          htmlFor="clause-variables"
          style={{ display: 'block', fontWeight: 600, marginBottom: 8 }}
        >
          Clause Variables
        </label>

        <textarea
          id="clause-variables"
          value={contract.clauseVariables}
          onChange={(event) =>
            updateField('clauseVariables', event.target.value)
          }
          placeholder="Record roles, duration, review dates, conditions, or other variables"
          rows={4}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            padding: 10,
            border: '1px solid #D0D5DD',
            borderRadius: 6,
            resize: 'vertical',
          }}
        />
      </section>

      <ContractListSection
        title="Consent Considerations"
        items={contract.consentConsiderations}
        onChange={(index, value) =>
          updateStringList('consentConsiderations', index, value)
        }
        onAdd={() => addStringListItem('consentConsiderations')}
        onRemove={(index) =>
          removeStringListItem('consentConsiderations', index)
        }
      />

      <ContractListSection
        title="Negotiated Agreements"
        items={contract.negotiatedAgreements}
        onChange={(index, value) =>
          updateStringList('negotiatedAgreements', index, value)
        }
        onAdd={() => addStringListItem('negotiatedAgreements')}
        onRemove={(index) =>
          removeStringListItem('negotiatedAgreements', index)
        }
      />

      <ContractListSection
        title="Agreement Clauses"
        items={contract.agreementClauses}
        onChange={(index, value) =>
          updateStringList('agreementClauses', index, value)
        }
        onAdd={() => addStringListItem('agreementClauses')}
        onRemove={(index) => removeStringListItem('agreementClauses', index)}
      />

      <section style={{ marginBottom: 28 }}>
        <h2
          style={{
            fontFamily: 'var(--font-header)',
            fontWeight: 'normal',
            fontSize: 20,
          }}
        >
          Carried-Forward Hard Limits
        </h2>

        {contract.lockedHardLimits.length === 0 ? (
          <p style={{ fontStyle: 'italic' }}>No hard limits available.</p>
        ) : (
          contract.lockedHardLimits.map((boundary) => (
            <div
              key={boundary.activityId}
              style={{
                padding: 12,
                marginBottom: 8,
                borderLeft: '4px solid var(--brick-ember)',
                backgroundColor: '#FDF8F8',
              }}
            >
              <strong>{boundary.activityName}</strong>
            </div>
          ))
        )}
      </section>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="button"
          onClick={() => setShowHandshake(true)}
          style={{
            padding: '12px 24px',
            border: 'none',
            borderRadius: 6,
            backgroundColor: 'var(--indigo)',
            color: '#FFFFFF',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Review and Sign
        </button>
      </div>
    </div>
  );
};

interface ContractListSectionProps {
  title: string;
  items: string[];
  onChange: (index: number, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const ContractListSection: React.FC<ContractListSectionProps> = ({
  title,
  items,
  onChange,
  onAdd,
  onRemove,
}) => (
  <section style={{ marginBottom: 28 }}>
    <h2
      style={{
        fontFamily: 'var(--font-header)',
        fontWeight: 'normal',
        fontSize: 20,
      }}
    >
      {title}
    </h2>

    {items.map((item, index) => (
      <div
        key={`${title}-${index}`}
        style={{ display: 'flex', gap: 8, marginBottom: 8 }}
      >
        <input
          value={item}
          onChange={(event) => onChange(index, event.target.value)}
          style={{
            flex: 1,
            padding: 10,
            border: '1px solid #D0D5DD',
            borderRadius: 6,
          }}
        />

        <button type="button" onClick={() => onRemove(index)}>
          Remove
        </button>
      </div>
    ))}

    <button type="button" onClick={onAdd}>
      Add
    </button>
  </section>
);