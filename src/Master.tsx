import React from 'react';
import { Sequence, AbsoluteFill } from 'remotion';
import { Scene01Problem } from './scenes/Scene01Problem';

const TIMINGS = {
  scene01: { from: 0, duration: 240 },
  // remaining scenes added in future PRPs
};

export const Master: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence
        from={TIMINGS.scene01.from}
        durationInFrames={TIMINGS.scene01.duration}
      >
        <Scene01Problem />
      </Sequence>
    </AbsoluteFill>
  );
};
