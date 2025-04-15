
import { learningModes } from '../constants';

interface LearningModeSelectionProps {
  onSelectMode: (modeName: string) => void;
}

const LearningModeSelection = ({ onSelectMode }: LearningModeSelectionProps) => {
  return (
    <div className="mb-4">
      <p className="text-xs text-foreground/70 mb-2">Choose your learning mode:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {learningModes.map((mode) => (
          <button
            key={mode.id}
            className="glass-card p-3 rounded-lg hover:neon-border-light transition-all flex items-center space-x-3"
            onClick={() => onSelectMode(mode.name)}
          >
            <div className="p-2 bg-thinkforge-purple/20 rounded-full">
              {mode.icon}
            </div>
            <div className="text-left">
              <p className="font-medium text-sm">{mode.name}</p>
              <p className="text-xs text-foreground/70">{mode.description}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LearningModeSelection;
