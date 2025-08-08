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
  FormControlLabel,
  Fab,
  Zoom,
  Slide,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  ButtonGroup
} from '@mui/material';
import {
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
  Settings as SettingsIcon,
  Add as AddIcon,
  Timeline as TimelineIcon,
  Hub as NetworkIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import FlowchartViewer from '@/components/flowchart/FlowchartViewer';
import { flowchartService, StudyPlan, GenerationOptions } from '@/lib/flowchart';

const FlowchartStudio = () => {
  const navigate = useNavigate();
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedType, setSelectedType] = useState<'study-plan' | 'mind-map'>('study-plan');
  const [customTopic, setCustomTopic] = useState('');
  const [complexity, setComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fastMode, setFastMode] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);

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
      title: 'Digital Marketing', 
      description: 'Online marketing strategies',
      category: 'Business',
      difficulty: 'beginner' as const,
      icon: '📱',
      color: '#45b7d1'
    },
    { 
      title: 'Data Structures', 
      description: 'Computer science fundamentals',
      category: 'Computer Science',
      difficulty: 'intermediate' as const,
      icon: '🔗',
      color: '#96ceb4'
    },
    { 
      title: 'Project Management', 
      description: 'Team leadership and project planning',
      category: 'Management',
      difficulty: 'beginner' as const,
      icon: '📊',
      color: '#feca57'
    },
    { 
      title: 'Cybersecurity', 
      description: 'Information security and protection',
      category: 'Security',
      difficulty: 'advanced' as const,
      icon: '🔒',
      color: '#ff9ff3'
    }
  ];

  const handleTopicSelect = useCallback((topic: string, difficulty?: 'beginner' | 'intermediate' | 'advanced') => {
    setSelectedTopic(topic);
    setCustomTopic('');
    if (difficulty) {
      setComplexity(difficulty);
    }
  }, []);

  const handleGenerate = useCallback(async () => {
    const topic = customTopic || selectedTopic;
    if (!topic) {
      setError('Please select or enter a topic to generate a flowchart');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedPlan(null);
    setShowWelcome(false);

    try {
      const options: GenerationOptions = { complexity, fastMode };
      let plan: StudyPlan;
      
      if (selectedType === 'mind-map') {
        plan = await flowchartService.generateMindMap(topic, options);
      } else {
        plan = await flowchartService.generateStudyPlan(topic, options);
      }
      setGeneratedPlan(plan);
    } catch (err) {
      setError('Failed to generate flowchart. Please check your connection and try again.');
      console.error('Generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [customTopic, selectedTopic, selectedType, complexity, fastMode]);

  const handleDownload = useCallback(() => {
    if (!generatedPlan) return;
    
    const dataStr = JSON.stringify(generatedPlan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${generatedPlan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_flowchart.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  }, [generatedPlan]);

  const handleShare = useCallback(async () => {
    if (!generatedPlan) return;
    
    const topic = customTopic || selectedTopic;
    const shareUrl = `/flowchart?topic=${encodeURIComponent(topic)}&type=${selectedType}&complexity=${complexity}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: generatedPlan.title,
          text: generatedPlan.description,
          url: window.location.origin + shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(window.location.origin + shareUrl);
        // You could add a snackbar notification here
        console.log('Flowchart link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  }, [generatedPlan, customTopic, selectedTopic, selectedType, complexity]);

  const getDifficultyColor = (difficulty: string): 'success' | 'warning' | 'error' | 'primary' => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'error';
      default: return 'primary';
    }
  };

  return (
    <Layout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              🎯 Flowchart Studio
            </Typography>
            <Typography 
              variant="h5" 
              color="text.secondary" 
              sx={{ mb: 3, maxWidth: 800, mx: 'auto' }}
            >
              Transform any topic into visual learning paths with AI-powered study plans and mind maps
            </Typography>
            <Stack 
              direction="row" 
              spacing={2} 
              justifyContent="center" 
              flexWrap="wrap"
              sx={{ gap: 1 }}
            >
              <Chip 
                icon={<AIIcon />} 
                label="AI-Powered Generation" 
                color="primary" 
                variant="outlined" 
              />
              <Chip 
                icon={<TimelineIcon />} 
                label="Interactive Flowcharts" 
                color="secondary" 
                variant="outlined" 
              />
              <Chip 
                icon={<NetworkIcon />} 
                label="Smart Connections" 
                color="info" 
                variant="outlined" 
              />
            </Stack>
          </Box>
        </motion.div>

        <Grid container spacing={4}>
          {/* Control Panel */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card 
                elevation={8} 
                sx={{ 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                      <FlowchartIcon />
                    </Avatar>
                    <Typography variant="h5" fontWeight="bold">
                      Generate Flowchart
                    </Typography>
                  </Box>
                  
                  <Stack spacing={3}>
                    {/* Type Selection */}
                    <FormControl fullWidth>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={selectedType}
                        label="Type"
                        onChange={(e) => setSelectedType(e.target.value as 'study-plan' | 'mind-map')}
                      >
                        <MenuItem value="study-plan">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TimelineIcon fontSize="small" />
                            Study Plan (Sequential Learning)
                          </Box>
                        </MenuItem>
                        <MenuItem value="mind-map">
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <MindMapIcon fontSize="small" />
                            Mind Map (Concept Mapping)
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {/* Custom Topic Input */}
                    <TextField
                      fullWidth
                      label="Enter Your Topic"
                      value={customTopic}
                      onChange={(e) => setCustomTopic(e.target.value)}
                      placeholder="What would you like to learn?"
                      multiline
                      rows={3}
                      variant="outlined"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        }
                      }}
                    />

                    {/* Complexity Selection */}
                    <FormControl fullWidth>
                      <InputLabel>Complexity Level</InputLabel>
                      <Select
                        value={complexity}
                        label="Complexity Level"
                        onChange={(e) => setComplexity(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                      >
                        <MenuItem value="beginner">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span>🟢 Beginner</span>
                            <Chip label="5-8 steps" size="small" color="success" variant="outlined" />
                          </Box>
                        </MenuItem>
                        <MenuItem value="intermediate">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span>🟡 Intermediate</span>
                            <Chip label="8-12 steps" size="small" color="warning" variant="outlined" />
                          </Box>
                        </MenuItem>
                        <MenuItem value="advanced">
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <span>🔴 Advanced</span>
                            <Chip label="12+ steps" size="small" color="error" variant="outlined" />
                          </Box>
                        </MenuItem>
                      </Select>
                    </FormControl>

                    {/* Advanced Options */}
                    <Box>
                      <Button 
                        startIcon={<SettingsIcon />}
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        variant="outlined"
                        fullWidth
                        sx={{ borderRadius: 2 }}
                      >
                        {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                      </Button>
                      
                      <Slide direction="down" in={showAdvanced} mountOnEnter unmountOnExit>
                        <Box sx={{ mt: 2 }}>
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
                                Fast Generation Mode
                              </Box>
                            }
                          />
                        </Box>
                      </Slide>
                    </Box>

                    {/* Generate Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      onClick={handleGenerate}
                      disabled={isGenerating || (!customTopic && !selectedTopic)}
                      startIcon={isGenerating ? <CircularProgress size={20} /> : <GenerateIcon />}
                      sx={{ 
                        py: 1.5,
                        borderRadius: 3,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #1976D2 30%, #0288D1 90%)',
                        },
                        '&:disabled': {
                          background: 'rgba(0,0,0,0.12)',
                        }
                      }}
                    >
                      {isGenerating ? 'Generating...' : `Create ${selectedType === 'mind-map' ? 'Mind Map' : 'Study Plan'}`}
                    </Button>

                    {/* Error Display */}
                    <AnimatePresence>
                      {error && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <Alert severity="error" sx={{ borderRadius: 2 }}>
                            {error}
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Action Buttons */}
                    <AnimatePresence>
                      {generatedPlan && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <ButtonGroup fullWidth variant="outlined" sx={{ borderRadius: 2 }}>
                            <Tooltip title="Download JSON">
                              <Button onClick={handleDownload} sx={{ flex: 1 }}>
                                <DownloadIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Share Flowchart">
                              <Button onClick={handleShare} sx={{ flex: 1 }}>
                                <ShareIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Use in Chat">
                              <Button 
                                onClick={() => navigate('/chat', { 
                                  state: { flowchart: generatedPlan, topic: customTopic || selectedTopic } 
                                })}
                                sx={{ flex: 1 }}
                              >
                                <ViewIcon />
                              </Button>
                            </Tooltip>
                          </ButtonGroup>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Reset */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  startIcon={<RefreshIcon />}
                  onClick={() => {
                    setSelectedTopic('');
                    setCustomTopic('');
                    setGeneratedPlan(null);
                    setError(null);
                    setComplexity('intermediate');
                    setFastMode(false);
                    setShowWelcome(true);
                  }}
                  sx={{ borderRadius: 3 }}
                >
                  Reset All
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Visualization Panel */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card 
                elevation={8} 
                sx={{ 
                  borderRadius: 4,
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  minHeight: 700
                }}
              >
                <CardContent sx={{ p: 4, height: '100%' }}>
                  {showWelcome && !isGenerating && !generatedPlan && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      minHeight: 500,
                      textAlign: 'center'
                    }}>
                      <motion.div
                        animate={{ 
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 4,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <FlowchartIcon sx={{ fontSize: 120, color: 'primary.main', mb: 3, opacity: 0.7 }} />
                      </motion.div>
                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        Ready to Create Amazing Flowcharts! 🚀
                      </Typography>
                      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
                        Choose from featured topics below or enter your own custom topic to generate AI-powered study plans and mind maps
                      </Typography>

                      {/* Featured Topics Grid */}
                      <Grid container spacing={2} sx={{ maxWidth: 800 }}>
                        {featuredTopics.map((topic, index) => (
                          <Grid item xs={12} sm={6} md={4} key={topic.title}>
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Card 
                                sx={{ 
                                  cursor: 'pointer',
                                  borderRadius: 3,
                                  border: '2px solid transparent',
                                  '&:hover': {
                                    borderColor: topic.color,
                                    boxShadow: `0 8px 25px ${topic.color}30`
                                  },
                                  transition: 'all 0.3s ease'
                                }}
                                onClick={() => handleTopicSelect(topic.title, topic.difficulty)}
                              >
                                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                                  <Typography variant="h3" sx={{ mb: 1 }}>
                                    {topic.icon}
                                  </Typography>
                                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {topic.title}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {topic.description}
                                  </Typography>
                                  <Stack direction="row" spacing={1} justifyContent="center">
                                    <Chip 
                                      label={topic.category} 
                                      size="small" 
                                      variant="outlined"
                                    />
                                    <Chip 
                                      label={topic.difficulty} 
                                      size="small" 
                                      color={getDifficultyColor(topic.difficulty)}
                                      variant="filled"
                                    />
                                  </Stack>
                                </CardContent>
                              </Card>
                            </motion.div>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {isGenerating && (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      minHeight: 500
                    }}>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <CircularProgress size={80} sx={{ mb: 4 }} />
                      </motion.div>
                      <Typography variant="h4" gutterBottom fontWeight="bold">
                        🤖 AI is Creating Your Flowchart...
                      </Typography>
                      <Typography variant="h6" color="text.secondary" align="center" sx={{ mb: 2 }}>
                        Analyzing "{customTopic || selectedTopic}" and building a {complexity} {selectedType === 'mind-map' ? 'mind map' : 'study plan'}
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
                      transition={{ duration: 0.7 }}
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
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Floating Action Button */}
        <Zoom in={!!generatedPlan}>
          <Fab
            color="primary"
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            }}
            onClick={() => navigate('/chat', { 
              state: { flowchart: generatedPlan, topic: customTopic || selectedTopic } 
            })}
          >
            <AIIcon />
          </Fab>
        </Zoom>
      </Container>
    </Layout>
  );
};

export default FlowchartStudio;
