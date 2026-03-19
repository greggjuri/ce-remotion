import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  Easing,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { DiagramNode } from '../components/DiagramNode';
import { AnimatedArrow } from '../components/AnimatedArrow';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '600', '700'],
  subsets: ['latin'],
});

const NODE_WIDTH = 300;
const NODE_HEIGHT = 90;

const nodes = [
  {
    label: 'Human + Claude.ai',
    sublabel: 'writes init file',
    icon: '✍',
    enterFrame: 40,
    left: 310,
    top: 380,
    active: false,
  },
  {
    label: 'init file',
    sublabel: 'feature spec',
    icon: '📄',
    enterFrame: 100,
    left: 810,
    top: 380,
    active: false,
  },
  {
    label: 'Claude Code',
    sublabel: '/generate-prp',
    icon: '⚡',
    enterFrame: 160,
    left: 1310,
    top: 380,
    active: true,
  },
  {
    label: 'PRP',
    sublabel: 'reviewed & approved',
    icon: '✓',
    enterFrame: 220,
    left: 1310,
    top: 540,
    active: false,
  },
  {
    label: 'git push',
    sublabel: 'auto on completion',
    icon: '🚀',
    enterFrame: 280,
    left: 810,
    top: 540,
    active: false,
  },
];

const arrows = [
  { x1: 610, y1: 425, x2: 810, y2: 425, drawFrame: 70 },
  { x1: 1110, y1: 425, x2: 1310, y2: 425, drawFrame: 130 },
  { x1: 1460, y1: 470, x2: 1460, y2: 540, drawFrame: 190 },
  { x1: 1310, y1: 585, x2: 1110, y2: 585, drawFrame: 250 },
];

const stepLabels = [
  { text: '1. Define the task', x: 460, y: 680, appearFrame: 300 },
  { text: '2. Generate a PRP', x: 1460, y: 680, appearFrame: 330 },
  { text: '3. Review & approve', x: 1460, y: 740, appearFrame: 360 },
  { text: '4. Execute & commit', x: 960, y: 740, appearFrame: 390 },
];

export const Scene04PRPFlow: React.FC = () => {
  const frame = useCurrentFrame();

  // Headline — scales/fades in over frames 0–25
  const headlineProgress = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const headlineScale = interpolate(headlineProgress, [0, 1], [0.92, 1]);
  const headlineOpacity = headlineProgress;

  // Caption — fades in at frame 440
  const captionLocalFrame = Math.max(0, frame - 440);
  const captionOpacity = interpolate(captionLocalFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionVisible = frame >= 440;

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc', position: 'relative' }}>
      {/* Headline */}
      <div
        style={{
          position: 'absolute',
          top: 160,
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
        The CE Workflow
      </div>

      {/* Arrows (rendered before nodes so they appear behind) */}
      {arrows.map((a, i) => (
        <AnimatedArrow
          key={`arrow-${i}`}
          x1={a.x1}
          y1={a.y1}
          x2={a.x2}
          y2={a.y2}
          drawFrame={a.drawFrame}
          drawDuration={25}
        />
      ))}

      {/* Nodes */}
      {nodes.map((node) => (
        <div
          key={node.label}
          style={{
            position: 'absolute',
            left: node.left,
            top: node.top,
          }}
        >
          <DiagramNode
            label={node.label}
            sublabel={node.sublabel}
            icon={node.icon}
            enterFrame={node.enterFrame}
            active={node.active}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
          />
        </div>
      ))}

      {/* Step labels */}
      {stepLabels.map((label) => {
        const localFrame = Math.max(0, frame - label.appearFrame);
        const opacity = interpolate(localFrame, [0, 20], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const isVisible = frame >= label.appearFrame;

        return (
          <div
            key={label.text}
            style={{
              position: 'absolute',
              left: label.x,
              top: label.y,
              transform: 'translateX(-50%)',
              opacity: isVisible ? opacity : 0,
              fontFamily: interFont,
              fontSize: 16,
              fontWeight: 400,
              color: '#64748b',
              whiteSpace: 'nowrap',
            }}
          >
            {label.text}
          </div>
        );
      })}

      {/* Caption */}
      <div
        style={{
          position: 'absolute',
          top: 860,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: captionVisible ? captionOpacity : 0,
          fontFamily: interFont,
          fontSize: 26,
          fontWeight: 600,
          color: '#1e293b',
          whiteSpace: 'nowrap',
        }}
      >
        Every feature. Same process. Always.
      </div>
    </AbsoluteFill>
  );
};
