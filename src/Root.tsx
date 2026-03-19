import './index.css';
import { Composition } from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { TerminalDemo } from './TerminalDemo';
import { FileCardDemo } from './FileCardDemo';
import { DiagramDemo } from './DiagramDemo';
import { CodeDiffDemo } from './CodeDiffDemo';
import { Scene01Problem } from './scenes/Scene01Problem';
import { Scene02FileCards } from './scenes/Scene02FileCards';
import { Scene03ClaudeMD } from './scenes/Scene03ClaudeMD';
import { Scene04PRPFlow } from './scenes/Scene04PRPFlow';
import { Master } from './Master';

// Load fonts globally (subset to reduce network requests)
loadInter('normal', { weights: ['400', '500', '600', '700'], subsets: ['latin'] });
loadJetBrains('normal', { weights: ['400'], subsets: ['latin'] });

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="TerminalDemo"
        component={TerminalDemo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FileCardDemo"
        component={FileCardDemo}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DiagramDemo"
        component={DiagramDemo}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="CodeDiffDemo"
        component={CodeDiffDemo}
        durationInFrames={240}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene01"
        component={Scene01Problem}
        durationInFrames={330}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene02"
        component={Scene02FileCards}
        durationInFrames={270}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene03"
        component={Scene03ClaudeMD}
        durationInFrames={645}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Scene04"
        component={Scene04PRPFlow}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="Master"
        component={Master}
        durationInFrames={1845}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
