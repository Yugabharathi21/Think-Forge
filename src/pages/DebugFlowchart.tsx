import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Paper,
  Divider,
  IconButton,
  Tooltip,
  Alert,
  CircularProgress,
  Stack,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  AccountTree as FlowchartIcon,
  Psychology as MindMapIcon,
  PlayArrow as GenerateIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  Code as CodeIcon,
  Lightbulb as TipIcon,
  Speed as FastIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import FlowchartViewer from '@/components/flowchart/FlowchartViewer';
import { flowchartService, StudyPlan } from '@/lib/flowchart';

const DebugFlowchart = () => {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedType, setSelectedType] = useState<'study-plan' | 'mind-map'>('study-plan');
  const [customTopic, setCustomTopic] = useState('');
  const [complexity, setComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);
  const [fastMode, setFastMode] = useState(false);

  const sampleTopics = [
    'Machine Learning Fundamentals',
    'React.js Development',
    'Data Structures and Algorithms',
    'Python Programming',
    'Database Design',
    'Web Security',
    'DevOps Practices',
    'Mobile App Development',
    'Artificial Intelligence',
    'Blockchain Technology',
    'Cloud Computing',
    'Cybersecurity',
    'Full Stack Development',
    'System Design',
    'Network Programming',
    'Game Development'
  ];

  const quickPresets = [
    { topic: 'JavaScript ES6+', type: 'study-plan' as const, complexity: 'intermediate' as const },
    { topic: 'REST API Design', type: 'mind-map' as const, complexity: 'advanced' as const },
    { topic: 'Git Workflow', type: 'study-plan' as const, complexity: 'beginner' as const },
    { topic: 'Docker Containers', type: 'mind-map' as const, complexity: 'intermediate' as const }
  ];

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setCustomTopic('');
  };

  const handlePresetSelect = (preset: typeof quickPresets[0]) => {
    setCustomTopic(preset.topic);
    setSelectedTopic('');
    setSelectedType(preset.type);
    setComplexity(preset.complexity);
  };

  const handleGenerate = async () => {
    const topic = customTopic || selectedTopic;
    if (!topic) {
      setError('Please select or enter a topic');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedPlan(null);

    try {
      let plan: StudyPlan;
      const options = { complexity, fastMode };
      
      if (selectedType === 'mind-map') {
        plan = await flowchartService.generateMindMap(topic, options);
      } else {
        plan = await flowchartService.generateStudyPlan(topic, options);
      }
      setGeneratedPlan(plan);
    } catch (err) {
      setError('Failed to generate flowchart. Please try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedPlan) return;
    
    const dataStr = JSON.stringify(generatedPlan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${generatedPlan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = async () => {
    if (!generatedPlan) return;
    
    const topic = customTopic || selectedTopic;
    const shareUrl = `/study-plan?topic=${encodeURIComponent(topic)}&type=${selectedType}&complexity=${complexity}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: generatedPlan.title,
          text: generatedPlan.description,
          url: window.location.origin + shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin + shareUrl);
        alert('Study plan link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom
            sx={{
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 'bold'
            }}
          >
            🧠 Flowchart Studio
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Generate and test AI-powered study plans and mind maps with advanced options
          </Typography>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip label="AI Powered" color="primary" variant="outlined" />
            <Chip label="Interactive" color="secondary" variant="outlined" />
            <Chip label="Debug Mode" color="warning" variant="filled" />
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {/* Generation Panel */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              {/* Main Controls */}
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FlowchartIcon color="primary" />
                  Generator Controls
                </Typography>
                
                <Divider sx={{ mb: 3 }} />

                {/* Type Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={selectedType}
                    label="Type"
                    onChange={(e) => setSelectedType(e.target.value as 'study-plan' | 'mind-map')}
                  >
                    <MenuItem value="study-plan">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <FlowchartIcon fontSize="small" />
                        Study Plan (Sequential)
                      </Box>
                    </MenuItem>
                    <MenuItem value="mind-map">
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <MindMapIcon fontSize="small" />
                        Mind Map (Hierarchical)
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>

                {/* Complexity Selection */}
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel>Complexity</InputLabel>
                  <Select
                    value={complexity}
                    label="Complexity"
                    onChange={(e) => setComplexity(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                  >
                    <MenuItem value="beginner">🟢 Beginner (5-8 nodes)</MenuItem>
                    <MenuItem value="intermediate">🟡 Intermediate (8-12 nodes)</MenuItem>
                    <MenuItem value="advanced">🔴 Advanced (12+ nodes)</MenuItem>
                  </Select>
                </FormControl>

                {/* Fast Mode Toggle */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={fastMode}
                      onChange={(e) => setFastMode(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FastIcon fontSize="small" />
                      Fast Mode (simpler generation)
                    </Box>
                  }
                  sx={{ mb: 2 }}
                />

                {/* Custom Topic Input */}
                <TextField
                  fullWidth
                  label="Custom Topic"
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="Enter your own topic..."
                  multiline
                  rows={2}
                  sx={{ mb: 3 }}
                />

                {/* Generate Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleGenerate}
                  disabled={isGenerating || (!customTopic && !selectedTopic)}
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <GenerateIcon />}
                  sx={{ 
                    mb: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                    }
                  }}
                >
                  {isGenerating ? 'Generating...' : `Generate ${selectedType === 'mind-map' ? 'Mind Map' : 'Study Plan'}`}
                </Button>

                {/* Error Display */}
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}

                {/* Action Buttons */}
                {generatedPlan && (
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Tooltip title="Download JSON">
                      <IconButton onClick={handleDownload} color="primary" size="small">
                        <DownloadIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Share">
                      <IconButton onClick={handleShare} color="primary" size="small">
                        <ShareIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="View in Study Plan Page">
                      <IconButton 
                        component={RouterLink}
                        to={`/study-plan?topic=${encodeURIComponent(customTopic || selectedTopic)}&type=${selectedType}&complexity=${complexity}`}
                        color="primary"
                        size="small"
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Toggle JSON View">
                      <IconButton onClick={() => setShowJson(!showJson)} color="primary" size="small">
                        <CodeIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
              </Paper>

              {/* Quick Presets */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TipIcon color="secondary" />
                  Quick Presets
                </Typography>
                <Grid container spacing={1}>
                  {quickPresets.map((preset, index) => (
                    <Grid item xs={12} key={index}>
                      <Button
                        fullWidth
                        variant="outlined"
                        size="small"
                        onClick={() => handlePresetSelect(preset)}
                        sx={{ 
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          textTransform: 'none'
                        }}
                      >
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {preset.topic}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {preset.type} • {preset.complexity}
                          </Typography>
                        </Box>
                      </Button>
                    </Grid>
                  ))}
                </Grid>
              </Paper>

              {/* Sample Topics */}
              <Paper elevation={2} sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Sample Topics
                </Typography>
                <Box sx={{ maxHeight: 200, overflow: 'auto' }}>
                  <Grid container spacing={1}>
                    {sampleTopics.map((topic) => (
                      <Grid item xs={12} key={topic}>
                        <Chip
                          label={topic}
                          variant={selectedTopic === topic ? "filled" : "outlined"}
                          color={selectedTopic === topic ? "primary" : "default"}
                          onClick={() => handleTopicSelect(topic)}
                          size="small"
                          sx={{ 
                            width: '100%', 
                            justifyContent: 'flex-start',
                            '&:hover': { 
                              backgroundColor: selectedTopic === topic ? 'primary.dark' : 'action.hover' 
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Stack>
          </Grid>

          {/* Visualization Panel */}
          <Grid item xs={12} lg={8}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(10px)',
                minHeight: 600
              }}
            >
              {!generatedPlan && !isGenerating && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: 400,
                  color: 'text.secondary'
                }}>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                  >
                    <FlowchartIcon sx={{ fontSize: 100, mb: 2, opacity: 0.3 }} />
                  </motion.div>
                  <Typography variant="h5" gutterBottom>
                    Ready to Generate
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ maxWidth: 400 }}>
                    Select a topic from the samples, use a quick preset, or enter your own custom topic to generate an AI-powered flowchart
                  </Typography>
                  <Box sx={{ mt: 3, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Chip icon={<FlowchartIcon />} label="Study Plans" color="primary" variant="outlined" />
                    <Chip icon={<MindMapIcon />} label="Mind Maps" color="secondary" variant="outlined" />
                    <Chip icon={<FastIcon />} label="Fast Mode" color="info" variant="outlined" />
                  </Box>
                </Box>
              )}

              {isGenerating && (
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  minHeight: 400
                }}>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <CircularProgress size={80} sx={{ mb: 3 }} />
                  </motion.div>
                  <Typography variant="h5" gutterBottom>
                    🤖 AI is Working...
                  </Typography>
                  <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 2 }}>
                    Analyzing "{customTopic || selectedTopic}" and creating a {complexity} {selectedType === 'mind-map' ? 'mind map' : 'study plan'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {fastMode ? '⚡ Fast mode enabled - Quick generation' : '🧠 Deep analysis mode - Comprehensive structure'}
                  </Typography>
                </Box>
              )}

              {generatedPlan && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <FlowchartViewer
                    nodes={generatedPlan.nodes}
                    edges={generatedPlan.edges}
                    title={generatedPlan.title}
                    description={generatedPlan.description}
                    className="w-full"
                  />
                </motion.div>
              )}
            </Paper>

            {/* JSON Display */}
            {generatedPlan && showJson && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                <Paper 
                  elevation={2} 
                  sx={{ 
                    mt: 3, 
                    p: 3, 
                    borderRadius: 3,
                    background: 'rgba(0,0,0,0.05)',
                  }}
                >
                  <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CodeIcon />
                    JSON Output
                  </Typography>
                  <Box 
                    component="pre" 
                    sx={{ 
                      fontSize: '0.8rem', 
                      overflow: 'auto', 
                      maxHeight: 400,
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      color: '#00ff00',
                      p: 2,
                      borderRadius: 2,
                      border: '1px solid rgba(0,255,0,0.3)',
                      fontFamily: 'Monaco, Consolas, monospace'
                    }}
                  >
                    {JSON.stringify(generatedPlan, null, 2)}
                  </Box>
                </Paper>
              </motion.div>
            )}
          </Grid>
        </Grid>

        {/* Quick Reset */}
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setSelectedTopic('');
              setCustomTopic('');
              setGeneratedPlan(null);
              setError(null);
              setShowJson(false);
              setComplexity('intermediate');
              setFastMode(false);
            }}
            sx={{ borderRadius: 3 }}
          >
            Reset All Settings
          </Button>
        </Box>
      </Container>
    </Layout>
  );
};

export default DebugFlowchart;
