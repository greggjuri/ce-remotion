import React from 'react';
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Easing,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { Terminal } from '../components/Terminal';
import type { TerminalLine } from '../components/Terminal';
import { CodeDiff } from '../components/CodeDiff';
import type { DiffLine } from '../components/CodeDiff';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['600', '700'],
  subsets: ['latin'],
});

const terminalLines: TerminalLine[] = [
  { type: 'input', text: 'claude "refactor the auth module"' },
  { type: 'output', text: '✓ Reading CLAUDE.md...' },
  { type: 'output', text: '✓ Stack: Next.js + Prisma + TypeScript' },
  { type: 'output', text: '✓ Auth pattern: JWT with refresh tokens' },
  { type: 'output', text: '' },
  { type: 'output', text: 'Refactoring src/lib/auth.ts...' },
];

const diffLines: DiffLine[] = [
  { type: 'header', text: '// src/lib/auth.ts — refactored with context' },
  { type: 'removed', text: 'import jwt from "jsonwebtoken";' },
  { type: 'added', text: 'import { SignJWT, jwtVerify } from "jose";' },
  { type: 'added', text: 'import { db } from "@/lib/prisma";' },
  { type: 'context', text: '' },
  { type: 'added', text: 'export async function refreshToken(userId: string) {' },
  { type: 'added', text: '  const user = await db.user.findUnique({' },
  { type: 'added', text: '    where: { id: userId },' },
  { type: 'added', text: '  });' },
  { type: 'added', text: '  return new SignJWT({ sub: userId })' },
  { type: 'added', text: '    .setExpirationTime("1h")' },
  { type: 'added', text: '    .sign(process.env.JWT_SECRET!);' },
  { type: 'added', text: '}' },
];

export const Scene05Payoff: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Headline — scales/fades in over frames 0–25
  const headlineProgress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const headlineScale = interpolate(headlineProgress, [0, 1], [0.92, 1]);
  const headlineOpacity = headlineProgress;

  // Green ✓ — springs in at frame 330
  const checkLocalFrame = Math.max(0, frame - 330);
  const checkSpring = spring({
    frame: checkLocalFrame,
    fps,
    config: { damping: 200, stiffness: 150 },
  });
  const checkTranslateY = interpolate(checkSpring, [0, 1], [20, 0]);
  const checkOpacity = interpolate(checkSpring, [0, 1], [0, 1]);
  const checkVisible = frame >= 330;

  // Caption — fades in at frame 350
  const captionLocalFrame = Math.max(0, frame - 350);
  const captionOpacity = interpolate(captionLocalFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionVisible = frame >= 350;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 100,
          left: '50%',
          transform: `translateX(-50%) scale(${headlineScale})`,
          opacity: headlineOpacity,
          fontFamily: interFont,
          fontSize: 48,
          fontWeight: 700,
          color: '#e2e8f0',
          whiteSpace: 'nowrap',
        }}
      >
        Now, with CE in place.
      </div>

      {/* Terminal */}
      <div
        style={{
          position: 'absolute',
          top: 200,
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        <Terminal
          lines={terminalLines}
          startFrame={25}
          charsPerSecond={22}
          outputDelayFrames={8}
          width="1200px"
          height="auto"
        />
      </div>

      {/* CodeDiff — enters at frame 160 */}
      <Sequence from={160}>
        <div
          style={{
            position: 'absolute',
            top: 420,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 1200,
          }}
        >
          <CodeDiff
            lines={diffLines}
            enterFrame={0}
            lineDelayFrames={4}
          />
        </div>
      </Sequence>

      {/* Green ✓ */}
      <div
        style={{
          position: 'absolute',
          top: 820,
          left: '50%',
          transform: `translateX(-50%) translateY(${checkVisible ? checkTranslateY : 20}px)`,
          opacity: checkVisible ? checkOpacity : 0,
          fontSize: 72,
          color: '#22c55e',
        }}
      >
        ✓
      </div>

      {/* Caption */}
      <div
        style={{
          position: 'absolute',
          top: 900,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: captionVisible ? captionOpacity : 0,
          fontFamily: interFont,
          fontSize: 28,
          fontWeight: 600,
          color: '#e2e8f0',
          whiteSpace: 'nowrap',
        }}
      >
        Right answer. First time.
      </div>
    </AbsoluteFill>
  );
};
