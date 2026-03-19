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
  weights: ['400'],
  subsets: ['latin'],
});

export type TerminalLine =
  | { type: 'input'; text: string }
  | { type: 'output'; text: string }
  | { type: 'gap' };

interface TerminalProps {
  lines: TerminalLine[];
  startFrame?: number;
  charsPerSecond?: number;
  title?: string;
  width?: string;
  height?: string;
}

interface LineState {
  line: TerminalLine;
  startAt: number;
  duration: number;
}

export const Terminal: React.FC<TerminalProps> = ({
  lines,
  startFrame = 0,
  charsPerSecond = 18,
  title = 'bash',
  width = '100%',
  height = '100%',
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Entrance animation
  const slideIn = spring({
    frame,
    fps,
    config: { damping: 200, stiffness: 100 },
  });
  const translateY = interpolate(slideIn, [0, 1], [60, 0]);
  const entranceOpacity = interpolate(frame, [0, 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Compute line timing states
  const lineStates: LineState[] = [];
  let frameOffset = startFrame;
  for (const line of lines) {
    if (line.type === 'input') {
      const duration = Math.ceil((line.text.length / charsPerSecond) * fps);
      lineStates.push({ line, startAt: frameOffset, duration });
      frameOffset += duration;
    } else {
      lineStates.push({ line, startAt: frameOffset, duration: 0 });
    }
  }

  // Find cursor line: last input line that has started
  let cursorLineIndex = -1;
  let isTyping = false;
  for (let i = lineStates.length - 1; i >= 0; i--) {
    const ls = lineStates[i];
    if (ls.line.type === 'input' && frame >= ls.startAt) {
      cursorLineIndex = i;
      const visibleChars =
        ls.duration === 0
          ? (ls.line as { type: 'input'; text: string }).text.length
          : Math.floor(
              interpolate(
                frame,
                [ls.startAt, ls.startAt + ls.duration],
                [0, (ls.line as { type: 'input'; text: string }).text.length],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              ),
            );
      isTyping =
        visibleChars <
        (ls.line as { type: 'input'; text: string }).text.length;
      break;
    }
  }

  // If no input started yet, cursor on first input line
  if (cursorLineIndex === -1) {
    const firstInput = lineStates.findIndex((ls) => ls.line.type === 'input');
    if (firstInput !== -1) cursorLineIndex = firstInput;
  }

  // Cursor blink
  const blink = Math.floor(frame / (fps * 0.5)) % 2 === 0;
  const cursorOpacity = isTyping ? 1 : blink ? 1 : 0;

  const cursorSpan = (
    <span
      style={{
        display: 'inline-block',
        width: 2,
        height: '1.2em',
        backgroundColor: '#6366f1',
        opacity: cursorOpacity,
        verticalAlign: 'text-bottom',
        marginLeft: 1,
      }}
    />
  );

  return (
    <div
      style={{
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        transform: `translateY(${translateY}px)`,
        opacity: entranceOpacity,
      }}
    >
      {/* Title bar */}
      <div
        style={{
          backgroundColor: '#1e2433',
          height: 40,
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          paddingRight: 16,
          flexShrink: 0,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#ff5f57',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#febc2e',
            }}
          />
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#28c840',
            }}
          />
        </div>
        {/* Title */}
        <div
          style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            fontFamily: interFont,
            fontSize: 13,
            color: '#8b9ab0',
          }}
        >
          {title}
        </div>
      </div>

      {/* Body */}
      <div
        style={{
          backgroundColor: '#0f172a',
          padding: 24,
          borderBottomLeftRadius: 10,
          borderBottomRightRadius: 10,
          fontFamily: monoFont,
          fontSize: 18,
          lineHeight: '28px',
          overflow: 'hidden',
          flex: 1,
        }}
      >
        {lineStates.map((ls, i) => {
          // Show the cursor line even if typing hasn't started yet (empty prompt)
          const isVisible = frame >= ls.startAt || i === cursorLineIndex;
          if (!isVisible) return null;

          if (ls.line.type === 'gap') {
            return <div key={i} style={{ height: 28 }} />;
          }

          if (ls.line.type === 'output') {
            return (
              <div key={i} style={{ color: '#94a3b8' }}>
                {ls.line.text}
              </div>
            );
          }

          // Input line
          const inputText = ls.line.text;
          let visibleChars: number;
          if (ls.duration === 0) {
            visibleChars = inputText.length;
          } else if (frame < ls.startAt) {
            visibleChars = 0;
          } else {
            visibleChars = Math.floor(
              interpolate(
                frame,
                [ls.startAt, ls.startAt + ls.duration],
                [0, inputText.length],
                { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
              ),
            );
          }
          const displayedText = inputText.slice(0, visibleChars);
          const showCursor = i === cursorLineIndex;

          return (
            <div key={i}>
              <span style={{ color: '#22c55e' }}>~</span>
              <span style={{ color: '#94a3b8' }}>{' $ '}</span>
              <span style={{ color: '#e2e8f0' }}>{displayedText}</span>
              {showCursor && cursorSpan}
            </div>
          );
        })}
      </div>
    </div>
  );
};
