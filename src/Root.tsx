import './index.css';
import { Composition } from 'remotion';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { loadFont as loadJetBrains } from '@remotion/google-fonts/JetBrainsMono';
import { TerminalDemo } from './TerminalDemo';

// Load fonts globally (subset to reduce network requests)
loadInter('normal', { weights: ['400'], subsets: ['latin'] });
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
    </>
  );
};
