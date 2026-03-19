import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { FileCard } from '../components/FileCard';
import type { FileCardIcon } from '../components/FileCard';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

const cards: {
  filename: string;
  description: string;
  icon: FileCardIcon;
  enterFrame: number;
  left: number;
  top: number;
}[] = [
  {
    filename: 'CLAUDE.md',
    description: 'Project rules & conventions',
    icon: 'rules',
    enterFrame: 40,
    left: 564,
    top: 366,
  },
  {
    filename: 'decisions.md',
    description: 'Confirmed architectural choices',
    icon: 'decisions',
    enterFrame: 60,
    left: 976,
    top: 366,
  },
  {
    filename: 'task.md',
    description: 'Technical gotchas & patterns',
    icon: 'task',
    enterFrame: 80,
    left: 564,
    top: 594,
  },
  {
    filename: 'PRP',
    description: 'Scoped task with acceptance criteria',
    icon: 'prp',
    enterFrame: 100,
    left: 976,
    top: 594,
  },
];

export const Scene02FileCards: React.FC = () => {
  const frame = useCurrentFrame();

  // Headline — fades/scales in over frames 0–25
  const headlineProgress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const headlineScale = interpolate(headlineProgress, [0, 1], [0.92, 1]);
  const headlineOpacity = headlineProgress;

  // Subtitle — fades in at frame 140
  const subtitleLocalFrame = Math.max(0, frame - 140);
  const subtitleOpacity = interpolate(subtitleLocalFrame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleVisible = frame >= 140;

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 180,
          left: '50%',
          transform: `translateX(-50%) scale(${headlineScale})`,
          opacity: headlineOpacity,
          fontFamily: interFont,
          fontSize: 48,
          fontWeight: 700,
          color: '#1e293b',
          whiteSpace: 'nowrap',
        }}
      >
        The fix? Give Claude context.
      </div>

      {/* File Cards */}
      {cards.map((card) => (
        <div
          key={card.filename}
          style={{
            position: 'absolute',
            left: card.left,
            top: card.top,
          }}
        >
          <FileCard
            filename={card.filename}
            description={card.description}
            icon={card.icon}
            enterFrame={card.enterFrame}
          />
        </div>
      ))}

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          top: 848,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: subtitleVisible ? subtitleOpacity : 0,
          fontFamily: interFont,
          fontSize: 20,
          fontWeight: 400,
          color: '#64748b',
          whiteSpace: 'nowrap',
        }}
      >
        A structured information environment for every session.
      </div>
    </AbsoluteFill>
  );
};
