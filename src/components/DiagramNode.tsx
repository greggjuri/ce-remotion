import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

export interface DiagramNodeProps {
  label: string;
  sublabel?: string;
  icon?: string;
  enterFrame: number;
  active?: boolean;
  width?: number;
  height?: number;
}

export const DiagramNode: React.FC<DiagramNodeProps> = ({
  label,
  sublabel,
  icon,
  enterFrame,
  active = false,
  width = 280,
  height = 80,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const localFrame = Math.max(0, frame - enterFrame);
  const springValue = spring({
    frame: localFrame,
    fps,
    config: { damping: 200, stiffness: 120 },
  });
  const translateY = interpolate(springValue, [0, 1], [20, 0]);
  const opacity = interpolate(springValue, [0, 1], [0, 1]);

  const isVisible = frame >= enterFrame;

  const boxShadow = active
    ? '0 0 0 2px #6366f1, 0 4px 20px rgba(99,102,241,0.25)'
    : '0 2px 12px rgba(0,0,0,0.06)';

  return (
    <div
      style={{
        opacity: isVisible ? opacity : 0,
        transform: `translateY(${isVisible ? translateY : 20}px)`,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <div
        style={{
          width,
          height,
          backgroundColor: '#ffffff',
          border: '1.5px solid #e2e8f0',
          borderRadius: 12,
          boxShadow,
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontFamily: interFont,
          boxSizing: 'border-box',
        }}
      >
        {icon && (
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1e293b',
              lineHeight: '20px',
            }}
          >
            {label}
          </div>
          {sublabel && (
            <div
              style={{
                fontSize: 12,
                fontWeight: 400,
                color: '#94a3b8',
                marginTop: 2,
                lineHeight: '16px',
              }}
            >
              {sublabel}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
