import React from 'react';
import { CodeDiff } from './components/CodeDiff';
import type { DiffLine } from './components/CodeDiff';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['500'],
  subsets: ['latin'],
});

const beforeLines: DiffLine[] = [
  { type: 'header', text: '// AI response WITHOUT context engineering' },
  { type: 'removed', text: 'function refactorAuth() {' },
  { type: 'removed', text: '  // What framework are you using?' },
  {
    type: 'removed',
    text: '  // What does your folder structure look like?',
  },
  { type: 'removed', text: '  // I need more information to help.' },
  { type: 'removed', text: '}' },
];

const afterLines: DiffLine[] = [
  { type: 'header', text: '// AI response WITH context engineering' },
  { type: 'added', text: 'import { useAuth } from "@/lib/auth";' },
  { type: 'added', text: 'import { db } from "@/lib/prisma";' },
  { type: 'context', text: '' },
  { type: 'added', text: 'export async function refreshToken(' },
  { type: 'added', text: '  userId: string' },
  { type: 'added', text: '): Promise<AuthToken> {' },
  { type: 'added', text: '  const user = await db.user.findUnique({' },
  { type: 'added', text: '    where: { id: userId },' },
  { type: 'added', text: '  });' },
  { type: 'added', text: '}' },
];

export const CodeDiffDemo: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f172a',
        gap: 48,
      }}
    >
      {/* Left block — Without CE */}
      <div style={{ width: 800 }}>
        <div
          style={{
            fontFamily: interFont,
            fontSize: 12,
            fontWeight: 500,
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: 8,
            letterSpacing: '0.05em',
          }}
        >
          Without CE
        </div>
        <CodeDiff lines={beforeLines} title="Without CE" enterFrame={10} />
      </div>

      {/* Right block — With CE */}
      <div style={{ width: 800 }}>
        <div
          style={{
            fontFamily: interFont,
            fontSize: 12,
            fontWeight: 500,
            color: '#64748b',
            textTransform: 'uppercase',
            marginBottom: 8,
            letterSpacing: '0.05em',
          }}
        >
          With CE
        </div>
        <CodeDiff lines={afterLines} title="With CE" enterFrame={40} />
      </div>
    </div>
  );
};
