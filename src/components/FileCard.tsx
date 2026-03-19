import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

export type FileCardIcon = 'rules' | 'decisions' | 'task' | 'prp';

export interface FileCardProps {
  filename: string;
  description: string;
  icon: FileCardIcon;
  enterFrame: number;
}

const ICON_CONFIG: Record<
  FileCardIcon,
  { symbol: string; accent: string; bgAccent: string }
> = {
  rules: {
    symbol: '⚙',
    accent: '#6366f1',
    bgAccent: 'rgba(99, 102, 241, 0.15)',
  },
  decisions: {
    symbol: '✓',
    accent: '#22c55e',
    bgAccent: 'rgba(34, 197, 94, 0.15)',
  },
  task: {
    symbol: '⚡',
    accent: '#f59e0b',
    bgAccent: 'rgba(245, 158, 11, 0.15)',
  },
  prp: {
    symbol: '▶',
    accent: '#3b82f6',
    bgAccent: 'rgba(59, 130, 246, 0.15)',
  },
};

export const FileCard: React.FC<FileCardProps> = ({
  filename,
  description,
  icon,
  enterFrame,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterFrame);
  const springValue = spring({
    frame: localFrame,
    fps,
    config: { damping: 200, stiffness: 120 },
  });
  const translateY = interpolate(springValue, [0, 1], [40, 0]);
  const opacity = interpolate(springValue, [0, 1], [0, 1]);

  const isVisible = frame >= enterFrame;
  const config = ICON_CONFIG[icon];

  return (
    <div
      style={{
        opacity: isVisible ? opacity : 0,
        transform: `translateY(${isVisible ? translateY : 40}px)`,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          padding: 32,
          width: 380,
          height: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          fontFamily: interFont,
        }}
      >
        {/* Icon circle */}
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: config.bgAccent,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 22,
            color: config.accent,
          }}
        >
          {config.symbol}
        </div>

        {/* Filename */}
        <div
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#1e293b',
            marginTop: 16,
          }}
        >
          {filename}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: '#64748b',
            marginTop: 8,
          }}
        >
          {description}
        </div>
      </div>
    </div>
  );
};
