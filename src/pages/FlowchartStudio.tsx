import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Switch,
  FormControlLabel,
  Chip,
  OutlinedInput,
  Tabs,
  Tab,
  Divider,
  Alert,
  Paper,
  IconButton,
  Collapse,
  LinearProgress,
  CircularProgress,
  Stack,
  Fab,
  Zoom,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  ButtonGroup,
  Tooltip
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  Settings as SettingsIcon,
  PlayArrow as PlayArrowIcon,
  Speed as SpeedIcon,
  Psychology as PsychologyIcon,
  School as SchoolIcon,
  Assessment as AssessmentIcon,
  MenuBook as MenuBookIcon,
  AutoAwesome as AutoAwesomeIcon,
  AccountTree as FlowchartIcon,
  Psychology as MindMapIcon,
  PlayArrow as GenerateIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Visibility as ViewIcon,
  AutoAwesome as AIIcon,
  School as LearnIcon,
  Lightbulb as IdeaIcon,
  Speed as FastIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  Hub as NetworkIcon,
  YouTube,
  OndemandVideo
} from '@mui/icons-material';
import { styled, Theme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import FlowchartViewer from '../components/flowchart/FlowchartViewer';
import EnhancedFlowchartViewer from '../components/flowchart/EnhancedFlowchartViewer';
// Use enhanced module which also re-exports basic generateFlowchart wrapper
import { generateFlowchart, generateEnhancedFlowchart, EnhancedFlowchartResponse } from '../lib/flowchart-enhanced';
import {
  FlowchartType,
  TopicComplexity,
  FlowchartNode,
  FlowchartResponse,
  TopicType,
  TOPIC_TYPES,
  LearningStyle,
  TimeConstraint,
  EnhancedFlowchartNode,
} from '../features/chat/types'; // Some of these types are currently not defined; using local fallbacks where necessary

// Local fallback type definitions (to prevent TS errors if not yet implemented in chat/types)
// These align with the enhanced flowchart module exports
interface LocalFlowchartNode { id: string; label: string; description?: string; type: string; position: { x: number; y: number }; }
interface LocalFlowchartEdge { id: string; source: string; target: string; label?: string }
interface LocalFlowchartResponse { title: string; description: string; nodes: LocalFlowchartNode[]; edges: LocalFlowchartEdge[]; estimatedTime?: string; difficulty?: string }
// EnhancedFlowchartResponse imported from enhanced module

interface ExpandMoreProps { expand?: boolean; [key: string]: unknown }
const ExpandMoreButton = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props as ExpandMoreProps;
  return <IconButton {...other} />;
})(({ theme, expand }: { theme: Theme; expand?: boolean }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const FlowchartStudio = () => {
  const navigate = useNavigate();
  
  // Basic state
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedType, setSelectedType] = useState<FlowchartType>('study-plan');
  const [customTopic, setCustomTopic] = useState('');
  const [complexity, setComplexity] = useState<TopicComplexity>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedChart, setGeneratedChart] = useState<LocalFlowchartResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  
  // Enhanced features state
  const [useEnhanced, setUseEnhanced] = useState(true);
  const [adaptiveLearning, setAdaptiveLearning] = useState(true);
  const [includeAssessments, setIncludeAssessments] = useState(true);
  const [includeResources, setIncludeResources] = useState(true);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>('visual');
  const [timeConstraint, setTimeConstraint] = useState<TimeConstraint>('moderate');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [enhancedChart, setEnhancedChart] = useState<EnhancedFlowchartResponse | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});

  const featuredTopics = [
    { 
      title: 'Machine Learning', 
      description: 'AI and data science fundamentals',
      category: 'Technology',
      difficulty: 'advanced' as const,
      icon: '🤖',
      color: '#ff6b6b'
    },
    { 
      title: 'React Development', 
      description: 'Modern web development with React',
      category: 'Programming',
      difficulty: 'intermediate' as const,
      icon: '⚛️',
      color: '#4ecdc4'
    },
    { 
      title: 'Data Science', 
      description: 'Analytics and statistical modeling',
      category: 'Data',
      difficulty: 'advanced' as const,
      icon: '📊',
      color: '#45b7d1'
    },
    { 
      title: 'Digital Marketing', 
      description: 'Online marketing strategies',
      category: 'Business',
      difficulty: 'beginner' as const,
      icon: '📱',
      color: '#96ceb4'
    },
    { 
      title: 'Photography', 
      description: 'Art and technique of photography',
      category: 'Arts',
      difficulty: 'beginner' as const,
      icon: '📸',
      color: '#feca57'
    },
    { 
      title: 'Blockchain', 
      description: 'Distributed ledger technology',
      category: 'Technology',
      difficulty: 'advanced' as const,
      icon: '⛓️',
      color: '#ff9ff3'
    }
  ];

  const topicToGenerate = customTopic || selectedTopic;

  const handleGenerate = useCallback(async () => {
    if (!topicToGenerate) {
      setError('Please select or enter a topic');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedChart(null);
    setEnhancedChart(null);

    try {
      if (useEnhanced) {
        const result = await generateEnhancedFlowchart(
          topicToGenerate,
          selectedType,
          complexity,
          {
            learningStyle,
            timeConstraint,
            focusAreas,
            includeAssessments,
            includeResources,
            adaptiveLearning,
            fastMode
          }
        );
        setEnhancedChart(result);
      } else {
        const result = await generateFlowchart(
          topicToGenerate,
          selectedType,
          complexity,
          fastMode
        );
        setGeneratedChart(result);
      }
    } catch (err) {
      console.error('Error generating flowchart:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate flowchart');
    } finally {
      setIsGenerating(false);
    }
  }, [
    topicToGenerate,
    selectedType,
    complexity,
    fastMode,
    useEnhanced,
    focusAreas,
    learningStyle,
    timeConstraint,
    includeAssessments,
    includeResources,
    adaptiveLearning
  ]);

  // Handle node progress updates
  const handleNodeProgress = useCallback((nodeId: string, progress: number) => {
    setUserProgress(prev => ({
      ...prev,
      [nodeId]: progress
    }));
    
    // Save progress to localStorage
    const savedProgress = localStorage.getItem('learning-progress') || '{}';
    const allProgress = { ...JSON.parse(savedProgress), [nodeId]: progress };
    localStorage.setItem('learning-progress', JSON.stringify(allProgress));
  }, []);

  // Load progress from localStorage on mount
  React.useEffect(() => {
    const savedProgress = localStorage.getItem('learning-progress');
    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
  }, []);

  const handleFocusAreaChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const value = event.target.value as string | string[];
    setFocusAreas(typeof value === 'string' ? value.split(',') : value);
  };

  const getDifficultyColor = (difficulty: TopicComplexity) => {
    switch (difficulty) {
      case 'beginner': return '#4caf50';
      case 'intermediate': return '#ff9800';
      case 'advanced': return '#f44336';
      default: return '#757575';
    }
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              <motion.span
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                🎯 Flowchart Studio
              </motion.span>
            </Typography>
            <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
              Create intelligent learning paths and mind maps with AI-powered insights
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Configuration Panel */}
            <Grid item xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                      <SettingsIcon color="primary" />
                      <Typography variant="h6" fontWeight="bold">
                        Configuration
                      </Typography>
                    </Box>

                    {/* Enhanced Mode Toggle */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={useEnhanced}
                          onChange={(e) => setUseEnhanced(e.target.checked)}
                          color="primary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AutoAwesomeIcon fontSize="small" />
                          <Typography variant="body2">Enhanced Mode</Typography>
                        </Box>
                      }
                      sx={{ mb: 2 }}
                    />

                    {/* Topic Selection */}
                    <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      Select Topic
                    </Typography>
                    
                    <Grid container spacing={1} sx={{ mb: 2 }}>
                      {featuredTopics.map((topic) => (
                        <Grid item xs={6} key={topic.title}>
                          <Card
                            variant={selectedTopic === topic.title ? "outlined" : "elevation"}
                            sx={{
                              cursor: 'pointer',
                              border: selectedTopic === topic.title ? 2 : 1,
                              borderColor: selectedTopic === topic.title ? 'primary.main' : 'grey.300',
                              '&:hover': { transform: 'translateY(-2px)', boxShadow: 2 },
                              transition: 'all 0.2s',
                              height: '100%'
                            }}
                            onClick={() => {
                              setSelectedTopic(topic.title);
                              setCustomTopic('');
                            }}
                          >
                            <CardContent sx={{ p: 1.5, textAlign: 'center' }}>
                              <Typography variant="h6" sx={{ fontSize: '1.2rem', mb: 0.5 }}>
                                {topic.icon}
                              </Typography>
                              <Typography variant="caption" display="block" sx={{ fontWeight: 'bold' }}>
                                {topic.title}
                              </Typography>
                              <Chip
                                size="small"
                                label={topic.difficulty}
                                sx={{
                                  mt: 0.5,
                                  backgroundColor: getDifficultyColor(topic.difficulty),
                                  color: 'white',
                                  fontSize: '0.7rem'
                                }}
                              />
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Or enter custom topic:
                    </Typography>
                    <TextField
                      fullWidth
                      placeholder="e.g., Quantum Computing, Cooking Basics, etc."
                      value={customTopic}
                      onChange={(e) => {
                        setCustomTopic(e.target.value);
                        if (e.target.value) setSelectedTopic('');
                      }}
                      variant="outlined"
                      size="small"
                      sx={{ mb: 3 }}
                    />

                    {/* Type and Complexity */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Type</InputLabel>
                          <Select
                            value={selectedType}
                            label="Type"
                            onChange={(e) => setSelectedType(e.target.value as FlowchartType)}
                          >
                            <MenuItem value="study-plan">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <FlowchartIcon fontSize="small" />
                                Study Plan
                              </Box>
                            </MenuItem>
                            <MenuItem value="mind-map">
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MindMapIcon fontSize="small" />
                                Mind Map
                              </Box>
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Complexity</InputLabel>
                          <Select
                            value={complexity}
                            label="Complexity"
                            onChange={(e) => setComplexity(e.target.value as TopicComplexity)}
                          >
                            <MenuItem value="beginner">Beginner</MenuItem>
                            <MenuItem value="intermediate">Intermediate</MenuItem>
                            <MenuItem value="advanced">Advanced</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* Enhanced Options */}
                    {useEnhanced && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
                          Enhanced Options
                        </Typography>

                        {/* Learning Style */}
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>Learning Style</InputLabel>
                          <Select
                            value={learningStyle}
                            label="Learning Style"
                            onChange={(e) => setLearningStyle(e.target.value as LearningStyle)}
                          >
                            <MenuItem value="visual">Visual</MenuItem>
                            <MenuItem value="auditory">Auditory</MenuItem>
                            <MenuItem value="kinesthetic">Kinesthetic</MenuItem>
                            <MenuItem value="reading">Reading/Writing</MenuItem>
                          </Select>
                        </FormControl>

                        {/* Time Constraint */}
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>Time Constraint</InputLabel>
                          <Select
                            value={timeConstraint}
                            label="Time Constraint"
                            onChange={(e) => setTimeConstraint(e.target.value as TimeConstraint)}
                          >
                            <MenuItem value="intensive">Intensive (1-2 weeks)</MenuItem>
                            <MenuItem value="moderate">Moderate (1-2 months)</MenuItem>
                            <MenuItem value="relaxed">Relaxed (3+ months)</MenuItem>
                          </Select>
                        </FormControl>

                        {/* Focus Areas */}
                        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                          <InputLabel>Focus Areas</InputLabel>
                          <Select
                            multiple
                            value={focusAreas}
                            onChange={handleFocusAreaChange}
                            input={<OutlinedInput label="Focus Areas" />}
                            renderValue={(selected) => (
                              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {selected.map((value) => (
                                  <Chip key={value} label={value} size="small" />
                                ))}
                              </Box>
                            )}
                          >
                            <MenuItem value="theory">Theory</MenuItem>
                            <MenuItem value="practical">Practical</MenuItem>
                            <MenuItem value="projects">Projects</MenuItem>
                            <MenuItem value="certification">Certification</MenuItem>
                            <MenuItem value="career">Career</MenuItem>
                          </Select>
                        </FormControl>

                        {/* Feature Toggles */}
                        <Stack spacing={1}>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={includeAssessments}
                                onChange={(e) => setIncludeAssessments(e.target.checked)}
                                size="small"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssessmentIcon fontSize="small" />
                                <Typography variant="body2">Include Assessments</Typography>
                              </Box>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={includeResources}
                                onChange={(e) => setIncludeResources(e.target.checked)}
                                size="small"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <MenuBookIcon fontSize="small" />
                                <Typography variant="body2">Include Resources</Typography>
                              </Box>
                            }
                          />
                          <FormControlLabel
                            control={
                              <Switch
                                checked={adaptiveLearning}
                                onChange={(e) => setAdaptiveLearning(e.target.checked)}
                                size="small"
                              />
                            }
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PsychologyIcon fontSize="small" />
                                <Typography variant="body2">Adaptive Learning</Typography>
                              </Box>
                            }
                          />
                        </Stack>
                      </motion.div>
                    )}

                    <Divider sx={{ my: 2 }} />

                    {/* Fast Mode */}
                    <FormControlLabel
                      control={
                        <Switch
                          checked={fastMode}
                          onChange={(e) => setFastMode(e.target.checked)}
                          color="secondary"
                        />
                      }
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SpeedIcon fontSize="small" />
                          <Typography variant="body2">Fast Mode</Typography>
                        </Box>
                      }
                      sx={{ mb: 2 }}
                    />

                    {/* Generate Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleGenerate}
                      disabled={isGenerating || !topicToGenerate}
                      startIcon={isGenerating ? <CircularProgress size={20} /> : <GenerateIcon />}
                      sx={{ 
                        py: 1.5,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #0097A7 90%)',
                        }
                      }}
                    >
                      {isGenerating ? 'Generating...' : 'Generate Learning Path'}
                    </Button>

                    {error && (
                      <Alert severity="error" sx={{ mt: 2 }}>
                        {error}
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Flowchart Display */}
            <Grid item xs={12} lg={8}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {(generatedChart || enhancedChart) ? (
                  useEnhanced && enhancedChart ? (
                    <EnhancedFlowchartViewer
                      data={enhancedChart}
                      onNodeProgress={handleNodeProgress}
                      userProgress={userProgress}
                    />
                  ) : generatedChart ? (
                    <FlowchartViewer data={generatedChart} />
                  ) : null
                ) : (
                  <Card sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CardContent sx={{ textAlign: 'center' }}>
                      <motion.div
                        animate={{ 
                          rotate: 360,
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                        }}
                      >
                        <FlowchartIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
                      </motion.div>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Ready to create your learning path!
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Select a topic and click "Generate Learning Path" to get started
                      </Typography>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Layout>
  );
};

export default FlowchartStudio;
