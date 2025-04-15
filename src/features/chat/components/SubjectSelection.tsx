
import { subjects } from '../constants';

interface SubjectSelectionProps {
  onSelectSubject: (subject: string) => void;
}

const SubjectSelection = ({ onSelectSubject }: SubjectSelectionProps) => {
  return (
    <div className="mb-4">
      <p className="text-xs text-foreground/70 mb-2">Select a subject:</p>
      <div className="flex flex-wrap gap-2">
        {subjects.map((subject) => (
          <button
            key={subject}
            className="px-3 py-1 text-xs glass-card hover:neon-border-light transition-all rounded-full"
            onClick={() => onSelectSubject(subject)}
          >
            {subject}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSelection;
