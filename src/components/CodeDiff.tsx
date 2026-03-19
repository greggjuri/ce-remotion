import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: monoFont } = loadJetBrains('normal', {
  weights: ['400'],
  subsets: ['latin'],
});
const { fontFamily: interFont } = loadInter('normal', {
  weights: ['500'],
  subsets: ['latin'],
});

export type DiffLine =
  | { type: 'removed'; text: string }
  | { type: 'added'; text: string }
  | { type: 'context'; text: string }
  | { type: 'header'; text: string };

export interface CodeDiffProps {
  lines: DiffLine[];
  enterFrame?: number;
  lineDelayFrames?: number;
  title?: string;
}

const LINE_STYLES: Record<
  DiffLine['type'],
  { bg: string; color: string; prefix: string }
> = {
  removed: { bg: 'rgba(239,68,68,0.15)', color: '#fca5a5', prefix: '- ' },
  added: { bg: 'rgba(34,197,94,0.15)', color: '#86efac', prefix: '+ ' },
  context: { bg: 'transparent', color: '#94a3b8', prefix: '  ' },
  header: { bg: 'transparent', color: '#60a5fa', prefix: '   ' },
};

export const CodeDiff: React.FC<CodeDiffProps> = ({
  lines,
  enterFrame = 0,
  lineDelayFrames = 3,
  title,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Whole block entrance
  const springValue = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const translateY = interpolate(springValue, [0, 1], [30, 0]);
  const blockOpacity = interpolate(springValue, [0, 1], [0, 1]);

  return (
    <div
      style={{
        transform: `translateY(${translateY}px)`,
        opacity: blockOpacity,
      }}
    >
      <div
        style={{
          backgroundColor: '#0f172a',
          borderRadius: 12,
          overflow: 'hidden',
        }}
      >
        {/* Title bar */}
        {title && (
          <div
            style={{
              backgroundColor: '#1e2433',
              padding: '10px 12px',
              fontFamily: interFont,
              fontSize: 13,
              fontWeight: 500,
              color: '#8b9ab0',
            }}
          >
            {title}
          </div>
        )}

        {/* Diff body */}
        <div
          style={{
            padding: 20,
            fontFamily: monoFont,
            fontSize: 14,
            lineHeight: 1.7,
          }}
        >
          {lines.map((line, i) => {
            const lineRevealFrame = enterFrame + i * lineDelayFrames;
            if (frame < lineRevealFrame) return null;

            const lineAge = frame - lineRevealFrame;
            const lineOpacity = interpolate(lineAge, [0, 6], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });

            const style = LINE_STYLES[line.type];

            return (
              <div
                key={i}
                style={{
                  backgroundColor: style.bg,
                  color: style.color,
                  padding: '0 2px',
                  borderRadius: 1,
                  opacity: lineOpacity,
                  whiteSpace: 'pre',
                }}
              >
                {style.prefix}
                {line.text}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
