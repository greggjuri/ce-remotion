import React from 'react';
import { DiagramNode } from './components/DiagramNode';
import { AnimatedArrow } from './components/AnimatedArrow';

const NODE_WIDTH = 280;
const NODE_HEIGHT = 80;
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

const nodes = [
  {
    label: 'Human + Claude.ai',
    sublabel: 'writes init file',
    icon: '✍',
    enterFrame: 10,
  },
  {
    label: 'init file',
    sublabel: 'feature spec',
    icon: '📄',
    enterFrame: 30,
  },
  {
    label: 'Claude Code',
    sublabel: '/generate-prp',
    icon: '⚡',
    enterFrame: 50,
    active: true,
  },
  {
    label: 'PRP',
    sublabel: 'reviewed + approved',
    icon: '✓',
    enterFrame: 70,
  },
  {
    label: 'git push',
    sublabel: 'auto on completion',
    icon: '🚀',
    enterFrame: 90,
  },
];

// Layout: 5 nodes evenly spaced horizontally, centered vertically
const MARGIN_X = 60;
const availableWidth = CANVAS_WIDTH - 2 * MARGIN_X;
const gap = (availableWidth - nodes.length * NODE_WIDTH) / (nodes.length - 1);
const nodeY = (CANVAS_HEIGHT - NODE_HEIGHT) / 2;

const getNodeX = (index: number) => MARGIN_X + index * (NODE_WIDTH + gap);

export const DiagramDemo: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#f8fafc',
        position: 'relative',
      }}
    >
      {/* Arrows (rendered first, behind nodes) */}
      {nodes.slice(0, -1).map((_, i) => {
        const x1 = getNodeX(i) + NODE_WIDTH;
        const y1 = nodeY + NODE_HEIGHT / 2;
        const x2 = getNodeX(i + 1);
        const y2 = nodeY + NODE_HEIGHT / 2;
        const drawFrame = nodes[i + 1].enterFrame - 5;

        return (
          <AnimatedArrow
            key={`arrow-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            drawFrame={drawFrame}
          />
        );
      })}

      {/* Nodes */}
      {nodes.map((node, i) => (
        <div
          key={node.label}
          style={{
            position: 'absolute',
            left: getNodeX(i),
            top: nodeY,
          }}
        >
          <DiagramNode
            label={node.label}
            sublabel={node.sublabel}
            icon={node.icon}
            enterFrame={node.enterFrame}
            active={'active' in node && node.active}
          />
        </div>
      ))}
    </div>
  );
};
