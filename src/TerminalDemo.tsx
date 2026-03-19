import React from 'react';
import { Terminal } from './components/Terminal';
import type { TerminalLine } from './components/Terminal';

const lines: TerminalLine[] = [
  { type: 'input', text: 'claude "refactor the auth module"' },
  { type: 'output', text: 'Sure! What framework are you using?' },
  { type: 'output', text: 'And what does your folder structure look like?' },
  { type: 'gap' },
  { type: 'output', text: '(AI has no context. Just guessing.)' },
];

export const TerminalDemo: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        padding: 40,
      }}
    >
      <Terminal lines={lines} width="80%" height="auto" />
    </div>
  );
};
