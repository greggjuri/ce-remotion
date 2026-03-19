import React from 'react';
import { Sequence, AbsoluteFill } from 'remotion';
import { Scene01Problem } from './scenes/Scene01Problem';
import { Scene02FileCards } from './scenes/Scene02FileCards';
import { Scene03ClaudeMD } from './scenes/Scene03ClaudeMD';
import { Scene04PRPFlow } from './scenes/Scene04PRPFlow';

const TIMINGS = {
  scene01: { from: 0, duration: 330 },
  scene02: { from: 330, duration: 270 },
  scene03: { from: 600, duration: 645 },
  scene04: { from: 1245, duration: 600 },
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
      <Sequence
        from={TIMINGS.scene02.from}
        durationInFrames={TIMINGS.scene02.duration}
      >
        <Scene02FileCards />
      </Sequence>
      <Sequence
        from={TIMINGS.scene03.from}
        durationInFrames={TIMINGS.scene03.duration}
      >
        <Scene03ClaudeMD />
      </Sequence>
      <Sequence
        from={TIMINGS.scene04.from}
        durationInFrames={TIMINGS.scene04.duration}
      >
        <Scene04PRPFlow />
      </Sequence>
    </AbsoluteFill>
  );
};
