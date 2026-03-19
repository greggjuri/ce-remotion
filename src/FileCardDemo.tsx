import React from 'react';
import { FileCard } from './components/FileCard';
import type { FileCardIcon } from './components/FileCard';

const cards: {
  filename: string;
  description: string;
  icon: FileCardIcon;
  enterFrame: number;
}[] = [
  {
    filename: 'CLAUDE.md',
    description: 'Project rules & conventions',
    icon: 'rules',
    enterFrame: 10,
  },
  {
    filename: 'decisions.md',
    description: 'Confirmed architectural choices',
    icon: 'decisions',
    enterFrame: 25,
  },
  {
    filename: 'task.md',
    description: 'Technical gotchas & patterns',
    icon: 'task',
    enterFrame: 40,
  },
  {
    filename: 'PRP',
    description: 'Scoped task with acceptance criteria',
    icon: 'prp',
    enterFrame: 55,
  },
];

export const FileCardDemo: React.FC = () => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 380px)',
          gridTemplateRows: 'repeat(2, 200px)',
          gap: 32,
        }}
      >
        {cards.map((card) => (
          <FileCard
            key={card.filename}
            filename={card.filename}
            description={card.description}
            icon={card.icon}
            enterFrame={card.enterFrame}
          />
        ))}
      </div>
    </div>
  );
};
