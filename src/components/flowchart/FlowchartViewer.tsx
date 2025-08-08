import React, { useCallback, useMemo, useState } from 'react';
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
  Panel,
  useReactFlow,
  ReactFlowProvider,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Collapse,
  Stack,
  Divider,
  Switch,
  FormControlLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  CenterFocusStrong,
  Download,
  Fullscreen,
  FullscreenExit,
  Visibility,
  VisibilityOff,
  GridOn,
  GridOff,
  Info,
  Settings,
  Share,
  Print,
  PlayArrow,
  CheckCircle,
  Help,
  EmojiEvents,
  Assignment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

import { FlowchartNode, FlowchartEdge } from '@/lib/flowchart';

interface FlowchartViewerProps {
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  title: string;
  description: string;
  className?: string;
}

// Custom node styles based on type with enhanced Material UI design
const getNodeStyle = (type: string, isHighlighted: boolean = false) => {
  const baseStyle = {
    padding: '16px 20px',
    borderRadius: '16px',
    border: '3px solid',
    fontSize: '14px',
    fontWeight: '600',
    textAlign: 'center' as const,
    minWidth: '160px',
    minHeight: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: isHighlighted 
      ? '0 8px 32px rgba(0,0,0,0.24), 0 4px 16px rgba(0,0,0,0.12)' 
      : '0 4px 20px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: isHighlighted ? 'scale(1.08) translateY(-4px)' : 'scale(1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  };

  switch (type) {
    case 'start':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        borderColor: '#1B5E20',
        color: 'white',
        borderRadius: '40px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          borderRadius: 'inherit',
        }
      };
    case 'end':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)',
        borderColor: '#B71C1C',
        color: 'white',
        borderRadius: '40px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          borderRadius: 'inherit',
        }
      };
    case 'decision':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        borderColor: '#E65100',
        color: 'white',
        borderRadius: '12px',
        transform: isHighlighted 
          ? 'rotate(45deg) scale(1.08) translateY(-4px)' 
          : 'rotate(45deg)',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          borderRadius: 'inherit',
        }
      };
    case 'milestone':
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #9C27B0 0%, #6A1B9A 100%)',
        borderColor: '#4A148C',
        color: 'white',
        borderRadius: '50%',
        minWidth: '120px',
        minHeight: '120px',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          borderRadius: 'inherit',
        }
      };
    default: // process
      return {
        ...baseStyle,
        background: 'linear-gradient(135deg, #2196F3 0%, #1565C0 100%)',
        borderColor: '#0D47A1',
        color: 'white',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%)',
          borderRadius: 'inherit',
        }
      };
  }
};

const FlowchartViewerInner: React.FC<FlowchartViewerProps> = ({
  nodes: initialNodes,
  edges: initialEdges,
  title,
  description,
  className = '',
}) => {
  const { fitView, zoomIn, zoomOut, zoomTo } = useReactFlow();
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const [showBackground, setShowBackground] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(true);
  const [backgroundVariant, setBackgroundVariant] = useState<BackgroundVariant>(BackgroundVariant.Dots);
  const [showNodeInfo, setShowNodeInfo] = useState(false);
  const [flowchartHeight, setFlowchartHeight] = useState(500);

  // Convert our node format to ReactFlow format with enhanced styling
  const reactFlowNodes: Node[] = useMemo(() =>
    initialNodes.map((node) => ({
      id: node.id,
      type: 'default',
      position: node.position,
      data: {
        label: (
          <motion.div
            style={getNodeStyle(node.type, selectedNode === node.id)}
            whileHover={{ 
              scale: selectedNode === node.id ? 1.08 : 1.05,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              {/* Node Type Icon */}
              <Box sx={{ mb: 1, display: 'flex', justifyContent: 'center' }}>
                {node.type === 'start' && <PlayArrow sx={{ fontSize: 18 }} />}
                {node.type === 'end' && <CheckCircle sx={{ fontSize: 18 }} />}
                {node.type === 'decision' && <Help sx={{ fontSize: 18 }} />}
                {node.type === 'milestone' && <EmojiEvents sx={{ fontSize: 18 }} />}
                {node.type === 'process' && <Assignment sx={{ fontSize: 18 }} />}
              </Box>
              
              <Typography 
                variant="body2" 
                fontWeight="bold" 
                sx={{ 
                  mb: node.description ? 1 : 0,
                  fontSize: '13px',
                  lineHeight: 1.3,
                  textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                }}
              >
                {node.label}
              </Typography>
              
              {node.description && (
                <Typography 
                  variant="caption" 
                  sx={{ 
                    opacity: 0.9,
                    fontSize: '11px',
                    lineHeight: 1.2,
                    display: 'block',
                    textShadow: '0 1px 2px rgba(0,0,0,0.1)'
                  }}
                >
                  {node.description.length > 50 
                    ? `${node.description.substring(0, 50)}...` 
                    : node.description}
                </Typography>
              )}
            </Box>
          </motion.div>
        ),
      },
      style: {
        border: 'none',
        background: 'transparent',
        width: 'auto',
        height: 'auto',
      },
    })), [initialNodes, selectedNode]
  );

  const reactFlowEdges: Edge[] = useMemo(() =>
    initialEdges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      style: {
        stroke: selectedNode && (edge.source === selectedNode || edge.target === selectedNode) 
          ? '#2196F3' 
          : '#90A4AE',
        strokeWidth: selectedNode && (edge.source === selectedNode || edge.target === selectedNode) 
          ? 4 
          : 3,
        strokeDasharray: edge.label === 'prereq' ? '8,8' : undefined,
      },
      animated: selectedNode && (edge.source === selectedNode || edge.target === selectedNode),
      labelStyle: {
        fill: '#546E7A',
        fontWeight: 600,
        fontSize: '12px',
        fontFamily: 'Roboto, sans-serif',
      },
      labelBgStyle: {
        fill: 'rgba(255,255,255,0.9)',
        fillOpacity: 0.9,
      },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: selectedNode && (edge.source === selectedNode || edge.target === selectedNode) 
          ? '#2196F3' 
          : '#90A4AE',
        width: 20,
        height: 20,
      },
    })), [initialEdges, selectedNode]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(reactFlowNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(reactFlowEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleZoomIn = () => zoomIn();
  const handleZoomOut = () => zoomOut();
  const handleFitView = () => fitView();
  const handleResetZoom = () => zoomTo(1);

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setFlowchartHeight(isFullscreen ? 500 : window.innerHeight - 200);
  };

  const handleDownload = () => {
    // Simple download of the flowchart data
    const dataStr = JSON.stringify({ nodes: initialNodes, edges: initialEdges, title, description }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flowchart.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const selectedNodeData = selectedNode ? initialNodes.find(n => n.id === selectedNode) : null;

  return (
    <Box className={`flowchart-viewer ${className}`}>
      {/* Enhanced Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card elevation={3} sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight="bold" color="primary" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: '70%' }}>
                  {description}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip 
                  label={`${initialNodes.length} Nodes`} 
                  color="primary" 
                  size="small" 
                  variant="outlined" 
                />
                <Chip 
                  label={`${initialEdges.length} Connections`} 
                  color="secondary" 
                  size="small" 
                  variant="outlined" 
                />
              </Stack>
            </Box>
            
            {/* Control Bar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
              <Stack direction="row" spacing={1}>
                <ToggleButtonGroup
                  value={backgroundVariant}
                  exclusive
                  onChange={(_, newVariant) => newVariant && setBackgroundVariant(newVariant)}
                  size="small"
                >
                  <ToggleButton value={BackgroundVariant.Dots}>
                    <GridOn fontSize="small" />
                  </ToggleButton>
                  <ToggleButton value={BackgroundVariant.Lines}>
                    <GridOff fontSize="small" />
                  </ToggleButton>
                </ToggleButtonGroup>

                <FormControlLabel
                  control={<Switch checked={showMiniMap} onChange={(e) => setShowMiniMap(e.target.checked)} size="small" />}
                  label="Mini Map"
                  sx={{ ml: 1 }}
                />
                
                <FormControlLabel
                  control={<Switch checked={showLegend} onChange={(e) => setShowLegend(e.target.checked)} size="small" />}
                  label="Legend"
                />
              </Stack>

              <Stack direction="row" spacing={1}>
                <Tooltip title="Zoom In">
                  <IconButton onClick={handleZoomIn} size="small">
                    <ZoomIn />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out">
                  <IconButton onClick={handleZoomOut} size="small">
                    <ZoomOut />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Fit to View">
                  <IconButton onClick={handleFitView} size="small">
                    <CenterFocusStrong />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton onClick={handleDownload} size="small">
                    <Download />
                  </IconButton>
                </Tooltip>
                <Tooltip title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
                  <IconButton onClick={toggleFullscreen} size="small">
                    {isFullscreen ? <FullscreenExit /> : <Fullscreen />}
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Flowchart Container */}
      <Box sx={{ position: 'relative' }}>
        <Paper 
          elevation={4} 
          sx={{ 
            borderRadius: 3,
            overflow: 'hidden',
            height: flowchartHeight,
            position: isFullscreen ? 'fixed' : 'relative',
            top: isFullscreen ? 0 : 'auto',
            left: isFullscreen ? 0 : 'auto',
            right: isFullscreen ? 0 : 'auto',
            bottom: isFullscreen ? 0 : 'auto',
            zIndex: isFullscreen ? 9999 : 'auto',
            background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          }}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
            maxZoom={2}
            minZoom={0.1}
            snapToGrid
            snapGrid={[15, 15]}
          >
            <Controls 
              position="top-left"
              showInteractive={false}
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              }}
            />
            
            {showMiniMap && (
              <MiniMap 
                position="top-right"
                nodeColor={(node) => {
                  const nodeData = initialNodes.find(n => n.id === node.id);
                  switch (nodeData?.type) {
                    case 'start': return '#10b981';
                    case 'end': return '#ef4444';
                    case 'decision': return '#f59e0b';
                    case 'milestone': return '#8b5cf6';
                    default: return '#3b82f6';
                  }
                }}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                }}
              />
            )}
            
            {showBackground && (
              <Background 
                variant={backgroundVariant}
                gap={20} 
                size={1}
                color="#cbd5e1"
              />
            )}

            {/* Custom Panel for additional controls */}
            <Panel position="bottom-left">
              <Paper sx={{ p: 1, borderRadius: 2, background: 'rgba(255,255,255,0.9)' }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    Click nodes to highlight connections
                  </Typography>
                  {selectedNode && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => setSelectedNode(null)}
                      sx={{ fontSize: '0.7rem', py: 0.5 }}
                    >
                      Clear Selection
                    </Button>
                  )}
                </Stack>
              </Paper>
            </Panel>
          </ReactFlow>

          {/* Node Information Dialog */}
          <Dialog open={!!selectedNode} onClose={() => setSelectedNode(null)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Info color="primary" />
              Node Information
            </DialogTitle>
            <DialogContent>
              {selectedNodeData && (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    {selectedNodeData.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {selectedNodeData.description || 'No description available'}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <Chip label={`Type: ${selectedNodeData.type}`} size="small" />
                    <Chip label={`ID: ${selectedNodeData.id}`} size="small" variant="outlined" />
                  </Stack>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedNode(null)}>Close</Button>
            </DialogActions>
          </Dialog>
        </Paper>
      </Box>

      {/* Enhanced Legend */}
      <AnimatePresence>
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card elevation={2} sx={{ mt: 3, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" fontWeight="bold">
                    🎯 Node Types & Legend
                  </Typography>
                  <IconButton onClick={() => setShowLegend(false)} size="small">
                    <VisibilityOff />
                  </IconButton>
                </Box>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(76, 175, 80, 0.1)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#4CAF50', width: 24, height: 24 }}>
                          <PlayArrow sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">Start Point</Typography>
                          <Typography variant="caption" color="text.secondary">Begin journey</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(33, 150, 243, 0.1)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#2196F3', width: 24, height: 24 }}>
                          <Assignment sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">Process Step</Typography>
                          <Typography variant="caption" color="text.secondary">Action or task</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255, 152, 0, 0.1)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#FF9800', width: 24, height: 24, transform: 'rotate(45deg)' }}>
                          <Help sx={{ fontSize: 14, transform: 'rotate(-45deg)' }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">Decision</Typography>
                          <Typography variant="caption" color="text.secondary">Choice point</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(156, 39, 176, 0.1)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#9C27B0', width: 24, height: 24 }}>
                          <EmojiEvents sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">Milestone</Typography>
                          <Typography variant="caption" color="text.secondary">Achievement</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                  <Grid item xs={12} sm={6} md={2.4}>
                    <Card elevation={2} sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(244, 67, 54, 0.1)' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: '#F44336', width: 24, height: 24 }}>
                          <CheckCircle sx={{ fontSize: 14 }} />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">End Point</Typography>
                          <Typography variant="caption" color="text.secondary">Completion</Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!showLegend && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<Visibility />}
            onClick={() => setShowLegend(true)}
            size="small"
          >
            Show Legend
          </Button>
        </Box>
      )}
    </Box>
  );
};

const FlowchartViewer: React.FC<FlowchartViewerProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowchartViewerInner {...props} />
    </ReactFlowProvider>
  );
};

export default FlowchartViewer;
