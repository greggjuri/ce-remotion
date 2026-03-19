import React from 'react';
import {
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  Easing,
} from 'remotion';

export interface AnimatedArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  drawFrame: number;
  drawDuration?: number;
  color?: string;
}

export const AnimatedArrow: React.FC<AnimatedArrowProps> = ({
  x1,
  y1,
  x2,
  y2,
  drawFrame,
  drawDuration = 20,
  color = '#cbd5e1',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  void fps;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy);

  const localFrame = Math.max(0, frame - drawFrame);
  const progress = interpolate(localFrame, [0, drawDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const dashOffset = length * (1 - progress);

  // Arrowhead direction
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Arrowhead fades in during last 20% of draw
  const arrowheadOpacity = interpolate(progress, [0.8, 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const isVisible = frame >= drawFrame;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        opacity: isVisible ? 1 : 0,
      }}
    >
      {/* Arrow line */}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray={length}
        strokeDashoffset={dashOffset}
      />

      {/* Arrowhead — tip at origin, translated+rotated to endpoint */}
      <polygon
        points="0,0 -10,-4 -10,4"
        fill={color}
        opacity={arrowheadOpacity}
        transform={`translate(${x2}, ${y2}) rotate(${angle})`}
      />
    </svg>
  );
};
