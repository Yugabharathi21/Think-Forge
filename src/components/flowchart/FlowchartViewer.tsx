import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  MiniMap,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { FlowchartNode, FlowchartEdge } from '@/lib/flowchart';

interface FlowchartViewerProps {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  title: string;
  description: string;
  className?: string;
}

// Custom node styles based on type
const getNodeStyle = (type: string) => {
  const baseStyle = {
    padding: '10px',
    borderRadius: '8px',
    border: '2px solid',
    fontSize: '12px',
    fontWeight: '500',
    textAlign: 'center' as const,
    minWidth: '120px',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  switch (type) {
    case 'start':
      return {
        ...baseStyle,
        backgroundColor: '#10b981',
        borderColor: '#059669',
        color: 'white',
        borderRadius: '50px',
      };
    case 'end':
      return {
        ...baseStyle,
        backgroundColor: '#ef4444',
        borderColor: '#dc2626',
        color: 'white',
        borderRadius: '50px',
      };
    case 'decision':
      return {
        ...baseStyle,
        backgroundColor: '#f59e0b',
        borderColor: '#d97706',
        color: 'white',
        clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
      };
    default: // process
      return {
        ...baseStyle,
        backgroundColor: '#3b82f6',
        borderColor: '#2563eb',
        color: 'white',
      };
  }
};

const FlowchartViewer: React.FC<FlowchartViewerProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  title,
  description,
  className = '',
}) => {
  // Convert our node format to ReactFlow format
  const reactFlowNodes: Node[] = useMemo(() =>
    initialNodes.map((node) => ({
      id: node.id,
      type: 'default',
      position: node.position,
      data: {
        label: (
          <div style={getNodeStyle(node.type)}>
            {node.label}
          </div>
        ),
      },
      style: {
        border: 'none',
        background: 'transparent',
        width: 'auto',
        height: 'auto',
      },
    })), [initialNodes]
  );

  const reactFlowEdges: Edge[] = useMemo(() =>
    initialEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      style: {
        stroke: '#6b7280',
        strokeWidth: 2,
      },
    })), [initialEdges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  return (
    <div className={`flowchart-viewer ${className}`}>
      {/* Header */}
      <div className="mb-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>

      {/* Flowchart */}
      <div className="h-96 bg-white dark:bg-gray-900 rounded-lg border shadow-sm">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          fitView
          attributionPosition="bottom-left"
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              const nodeData = initialNodes.find(n => n.id === node.id);
              switch (nodeData?.type) {
                case 'start': return '#10b981';
                case 'end': return '#ef4444';
                case 'decision': return '#f59e0b';
                default: return '#3b82f6';
              }
            }}
          />
          <Background 
            variant={BackgroundVariant.Dots} 
            gap={20} 
            size={1}
            color="#e5e7eb"
          />
        </ReactFlow>
      </div>

      {/* Legend */}
      <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
          Legend
        </h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Process</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 transform rotate-45"></div>
            <span className="text-gray-600 dark:text-gray-400">Decision</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">End</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlowchartViewer;
