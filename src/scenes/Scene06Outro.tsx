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

  // "Use it." — fades in at frame 90
  const useItLocalFrame = Math.max(0, frame - 90);
  const useItOpacity = interpolate(useItLocalFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const useItVisible = frame >= 90;

  // "Or go fuck yourself." — fades in at frame 180 (3 seconds after "Use it.")
  const punchlineLocalFrame = Math.max(0, frame - 180);
  const punchlineOpacity = interpolate(punchlineLocalFrame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const punchlineVisible = frame >= 180;

  // Fade to white — 0.5 seconds (15 frames) after punchline starts: frames 195–225
  const fadeLocalFrame = Math.max(0, frame - 195);
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
          top: 340,
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
          top: 400,
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
          top: 530,
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

      {/* Use it. */}
      <div
        style={{
          position: 'absolute',
          top: 610,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: useItVisible ? useItOpacity : 0,
          fontFamily: interFont,
          fontSize: 36,
          fontWeight: 400,
          color: '#6366f1',
          whiteSpace: 'nowrap',
        }}
      >
        Use it.
      </div>

      {/* Or go fuck yourself. */}
      <div
        style={{
          position: 'absolute',
          top: 670,
          left: '50%',
          transform: 'translateX(-50%)',
          opacity: punchlineVisible ? punchlineOpacity : 0,
          fontFamily: interFont,
          fontSize: 36,
          fontWeight: 400,
          color: '#6366f1',
          whiteSpace: 'nowrap',
        }}
      >
        Or go fuck yourself.
      </div>

      {/* Fade to white overlay */}
      {frame >= 195 && (
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
