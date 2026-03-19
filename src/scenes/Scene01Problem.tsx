import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { Terminal } from '../components/Terminal';
import type { TerminalLine } from '../components/Terminal';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['500'],
  subsets: ['latin'],
});

const lines: TerminalLine[] = [
  { type: 'input', text: 'claude "refactor the auth module"' },
  { type: 'output', text: 'Sure! What framework are you using?' },
  { type: 'output', text: 'What does your folder structure look like?' },
  { type: 'output', text: 'Any specific patterns you want me to follow?' },
  { type: 'output', text: 'What are your naming conventions?' },
];

export const Scene01Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Red ✗ indicator — springs in at frame 160
  const xLocalFrame = Math.max(0, frame - 160);
  const xSpring = spring({
    frame: xLocalFrame,
    fps,
    config: { damping: 200, stiffness: 150 },
  });
  const xTranslateY = interpolate(xSpring, [0, 1], [20, 0]);
  const xOpacity = interpolate(xSpring, [0, 1], [0, 1]);
  const xVisible = frame >= 160;

  // Caption — fades in at frame 170
  const captionLocalFrame = Math.max(0, frame - 170);
  const captionOpacity = interpolate(captionLocalFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionVisible = frame >= 170;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: 60,
      }}
    >
      {/* Terminal */}
      <Terminal
        lines={lines}
        startFrame={20}
        outputDelayFrames={15}
        width="1200px"
        height="auto"
      />

      {/* Red ✗ */}
      <div
        style={{
          marginTop: 32,
          fontSize: 72,
          color: '#ef4444',
          opacity: xVisible ? xOpacity : 0,
          transform: `translateY(${xVisible ? xTranslateY : 20}px)`,
          textAlign: 'center',
        }}
      >
        ✗
      </div>

      {/* Caption */}
      <div
        style={{
          marginTop: 16,
          fontFamily: interFont,
          fontSize: 22,
          fontWeight: 500,
          color: '#94a3b8',
          opacity: captionVisible ? captionOpacity : 0,
          textAlign: 'center',
        }}
      >
        Every session. The same questions. Every time.
      </div>
    </AbsoluteFill>
  );
};
