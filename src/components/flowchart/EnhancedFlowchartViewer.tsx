import React from 'react';
import FlowchartViewer from './FlowchartViewer';
import { EnhancedFlowchartResponse } from '@/lib/flowchart-enhanced';

interface Props {
  data: EnhancedFlowchartResponse;
  onNodeProgress?: (nodeId: string, progress: number) => void; // reserved for future interactive tracking
  userProgress?: Record<string, number>;
}

// Placeholder implementation: reuse FlowchartViewer until enhanced visualization is implemented
const EnhancedFlowchartViewer: React.FC<Props> = ({ data }) => {
  return (
    <FlowchartViewer
      nodes={data.nodes}
      edges={data.edges}
      title={data.title}
      description={data.description}
    />
  );
};

export default EnhancedFlowchartViewer;
