import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
} from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';

const { fontFamily: interFont } = loadInter('normal', {
  weights: ['400', '500', '800'],
  subsets: ['latin'],
});

export const Scene06Outro: React.FC = () => {
  const frame = useCurrentFrame();

  // Accent line — scales from 0 to 80px over frames 0–20
  const lineWidth = interpolate(frame, [0, 20], [0, 80], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Main title — fades in at frame 20
  const titleLocalFrame = Math.max(0, frame - 20);
  const titleOpacity = interpolate(titleLocalFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleVisible = frame >= 20;

  // Subtitle — fades in at frame 45
  const subtitleLocalFrame = Math.max(0, frame - 45);
  const subtitleOpacity = interpolate(subtitleLocalFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const subtitleVisible = frame >= 45;

  // Domain — fades in at frame 90
  const domainLocalFrame = Math.max(0, frame - 90);
  const domainOpacity = interpolate(domainLocalFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const domainVisible = frame >= 90;

  // Fade to white — frames 270–300
  const fadeLocalFrame = Math.max(0, frame - 270);
  const fadeOpacity = interpolate(fadeLocalFrame, [0, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#f8fafc' }}>
      {/* Accent line */}
      <div
        style={{
          position: 'absolute',
          top: 420,
          left: '50%',
          transform: 'translateX(-50%)',
          width: lineWidth,
          height: 3,
          backgroundColor: '#6366f1',
        }}
      />

      {/* Main title */}
      <div
        style={{
          position: 'absolute',
          top: 500,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: titleVisible ? titleOpacity : 0,
          fontFamily: interFont,
          fontSize: 72,
          fontWeight: 800,
          color: '#1e293b',
          whiteSpace: 'nowrap',
        }}
      >
        Context Engineering
      </div>

      {/* Subtitle */}
      <div
        style={{
          position: 'absolute',
          top: 580,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: subtitleVisible ? subtitleOpacity : 0,
          fontFamily: interFont,
          fontSize: 36,
          fontWeight: 400,
          color: '#6366f1',
          whiteSpace: 'nowrap',
        }}
      >
        with Claude Code
      </div>

      {/* Domain */}
      <div
        style={{
          position: 'absolute',
          top: 660,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: domainVisible ? domainOpacity : 0,
          fontFamily: interFont,
          fontSize: 22,
          fontWeight: 500,
          color: '#94a3b8',
          whiteSpace: 'nowrap',
        }}
      >
        jurigregg.com
      </div>

      {/* Fade to white overlay */}
      {frame >= 270 && (
        <AbsoluteFill
          style={{
            backgroundColor: '#ffffff',
            opacity: fadeOpacity,
          }}
        />
      )}
    </AbsoluteFill>
  );
};
