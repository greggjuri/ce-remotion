import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { Terminal } from '../components/Terminal';
import type { TerminalLine } from '../components/Terminal';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '500', '600'],
  subsets: ['latin'],
});

const lines: TerminalLine[] = [
  { type: 'input', text: '## Project Overview' },
  { type: 'output', text: 'CE demo video for jurigregg.com blog.' },
  { type: 'output', text: 'Explains Context Engineering fundamentals.' },
  { type: 'gap' },
  { type: 'input', text: '## Stack' },
  { type: 'output', text: 'Remotion 4.x + React + TypeScript' },
  { type: 'output', text: 'Tailwind CSS · Inter · JetBrains Mono' },
  { type: 'gap' },
  { type: 'input', text: '## Code Principles' },
  { type: 'output', text: 'One component per file, named export' },
  { type: 'output', text: 'useCurrentFrame() for ALL animation' },
  { type: 'output', text: 'No hardcoded frame numbers' },
  { type: 'gap' },
  { type: 'input', text: '## Git Workflow' },
  { type: 'output', text: 'git add -A && git commit && git push' },
  { type: 'output', text: 'After EVERY completed feature. No exceptions.' },
];

const annotations = [
  { text: 'What this project is', appearFrame: 71, top: 238 },
  { text: 'Tech stack & dependencies', appearFrame: 112, top: 350 },
  { text: 'How Claude should write code', appearFrame: 167, top: 462 },
  { text: 'Keeps git history clean', appearFrame: 218, top: 588 },
];

interface AnnotationProps {
  text: string;
  appearFrame: number;
  top: number;
}

const Annotation: React.FC<AnnotationProps> = ({
  text,
  appearFrame,
  top,
}) => {
  const frame = useCurrentFrame();

  const localFrame = Math.max(0, frame - appearFrame);
  const opacity = interpolate(localFrame, [0, 15], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isVisible = frame >= appearFrame;

  return (
    <div
      style={{
        position: 'absolute',
        left: 880,
        top,
        display: 'flex',
        alignItems: 'center',
        gap: 0,
        opacity: isVisible ? opacity : 0,
      }}
    >
      {/* Connecting line */}
      <div
        style={{
          width: 40,
          height: 1,
          backgroundColor: '#6366f1',
          opacity: 0.5,
          flexShrink: 0,
        }}
      />
      {/* Dot */}
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          backgroundColor: '#6366f1',
          flexShrink: 0,
        }}
      />
      {/* Text */}
      <div
        style={{
          marginLeft: 12,
          fontFamily: interFont,
          fontSize: 16,
          fontWeight: 400,
          color: '#6366f1',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </div>
    </div>
  );
};

export const Scene03ClaudeMD: React.FC = () => {
  const frame = useCurrentFrame();

  // Headline — fades in over frames 0–20
  const headlineOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Caption — fades in at frame 370
  const captionLocalFrame = Math.max(0, frame - 360);
  const captionOpacity = interpolate(captionLocalFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionVisible = frame >= 360;

  return (
    <AbsoluteFill style={{ backgroundColor: '#0f172a' }}>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: headlineOpacity,
          fontFamily: interFont,
          fontSize: 32,
          fontWeight: 600,
          color: '#e2e8f0',
          whiteSpace: 'nowrap',
        }}
      >
        CLAUDE.md — your AI's source of truth
      </div>

      {/* Terminal */}
      <div
        style={{
          position: 'absolute',
          left: 310,
          top: 160,
        }}
      >
        <Terminal
          lines={lines}
          startFrame={40}
          charsPerSecond={22}
          inputDelayFrames={30}
          title="CLAUDE.md"
          width="900px"
          height="560px"
        />
      </div>

      {/* Annotations */}
      {annotations.map((a) => (
        <Annotation
          key={a.text}
          text={a.text}
          appearFrame={a.appearFrame}
          top={a.top}
        />
      ))}

      {/* Caption */}
      <div
        style={{
          position: 'absolute',
          top: 900,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: captionVisible ? captionOpacity : 0,
          fontFamily: interFont,
          fontSize: 22,
          fontWeight: 500,
          color: '#94a3b8',
          whiteSpace: 'nowrap',
        }}
      >
        Claude Code reads this at the start of every session.
      </div>
    </AbsoluteFill>
  );
};
