import { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  useTheme,
  styled,
  Link,
  Divider,
  Paper
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ChatIcon from '@mui/icons-material/Chat';
import QuizIcon from '@mui/icons-material/Quiz';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import SettingsIcon from '@mui/icons-material/Settings';

import Layout from '@/components/layout/Layout';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';

// Styled components
const HeroContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  overflow: 'hidden',
  paddingTop: theme.spacing(12),
  paddingBottom: theme.spacing(12),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(20),
    paddingBottom: theme.spacing(20),
  },
}));

const FeatureCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.palette.mode === 'light' 
      ? '0 10px 30px rgba(0,0,0,0.1)' 
      : '0 10px 30px rgba(0,0,0,0.3)',
  },
}));

const IconBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 60,
  height: 60,
  borderRadius: '12px',
  marginBottom: theme.spacing(2),
  backgroundColor: theme.palette.mode === 'light' 
    ? theme.palette.primary.light + '30' // Adding transparency
    : theme.palette.primary.dark + '50', 
}));

const Home = () => {
  const theme = useTheme();
  const { mode } = useAppTheme();
  
  const features = [
    {
      title: "AI Learning Companion",
      description: "Engage in dynamic conversations with an AI tutor that adapts to your learning style and pace.",
      icon: <ChatIcon fontSize="large" color="primary" />,
      link: "/chat"
    },
    {
      title: "Interactive Quizzes",
      description: "Test your knowledge with adaptive multiple-choice questions that challenge your understanding.",
      icon: <QuizIcon fontSize="large" color="primary" />,
      link: "/mcq-quiz"
    },
    {
      title: "Progress Tracking",
      description: "Monitor your improvement over time with detailed analytics and personalized feedback.",
      icon: <BarChartIcon fontSize="large" color="primary" />,
      link: "/progress"
    },
    {
      title: "Customizable Subjects",
      description: "Choose from a wide range of subjects and topics tailored to your interests and educational goals.",
      icon: <SchoolIcon fontSize="large" color="primary" />,
      link: "/chat"
    },
    {
      title: "Multiple Learning Modes",
      description: "Switch between different learning modes to reinforce concepts through varied approaches.",
      icon: <SettingsIcon fontSize="large" color="primary" />,
      link: "/chat"
    },
    {
      title: "Instant Feedback",
      description: "Receive immediate explanations and corrections to strengthen your understanding of concepts.",
      icon: <PsychologyIcon fontSize="large" color="primary" />,
      link: "/chat"
    }
  ];
  
  return (
    <Layout>
      {/* Hero Section */}
      <HeroContainer>
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography 
                    component="h1"
                    variant="h2"
                    fontWeight="700"
                    gutterBottom
                  >
                    Think-Forge
                    <Box 
                      component="span" 
                      sx={{ 
                        color: 'primary.main', 
                        display: 'inline-block',
                        ml: 1
                      }}
                    >
                      AI
                    </Box>
                  </Typography>
                  
                  <Typography 
                    variant="h5" 
                    color="text.secondary" 
                    paragraph
                    sx={{ mb: 4, maxWidth: '90%' }}
                  >
                    Unlock deeper learning through AI-powered conversations. Master concepts, challenge your understanding, and track your progress.
                  </Typography>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                  >
                    <Button
                      component={RouterLink}
                      to="/chat"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForwardIcon />}
                    >
                      Start Learning
                    </Button>
                    
                    <Button
                      component={RouterLink}
                      to="/signup"
                      variant="outlined"
                      size="large"
                      sx={{ ml: 2 }}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </motion.div>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative' }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1 }}
                >
                  <Paper 
                    elevation={6}
                    sx={{ 
                      overflow: 'hidden',
                      height: '400px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: mode === 'light' ? 'primary.light' : 'background.paper',
                      border: `1px solid ${theme.palette.divider}`,
                      position: 'relative',
                    }}
                  >
                    {/* This would be a custom illustration or animation */}
                    <Box sx={{ 
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0.1,
                      background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
                    }} />
                    
                    <PsychologyIcon sx={{ fontSize: 120, opacity: 0.3, color: 'primary.main' }} />
                  </Paper>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroContainer>

      {/* Features Section */}
      <Box sx={{ py: 8, bgcolor: mode === 'light' ? 'grey.50' : 'background.paper' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" gutterBottom>
              Features
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ maxWidth: '700px', mx: 'auto' }}
            >
              Personalized learning tools designed to enhance your understanding
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <FeatureCard>
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <IconBox>
                        {feature.icon}
                      </IconBox>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {feature.title}
                      </Typography>
                      <Typography color="text.secondary" paragraph sx={{ mb: 2, flexGrow: 1 }}>
                        {feature.description}
                      </Typography>
                      <Link 
                        component={RouterLink} 
                        to={feature.link}
                        color="primary"
                        sx={{ 
                          display: 'flex', 
                          alignItems: 'center',
                          mt: 'auto',
                          fontWeight: 500,
                          '&:hover': { textDecoration: 'none' }
                        }}
                      >
                        Learn More
                        <ArrowForwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                      </Link>
                    </CardContent>
                  </FeatureCard>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box sx={{ py: 10, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Transform Your Learning?
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 4 }}>
            Join Think-Forge today and experience a new way to learn, challenge yourself, and grow
          </Typography>
          <Button 
            component={RouterLink} 
            to="/signup" 
            variant="contained" 
            size="large"
          >
            Get Started
          </Button>
        </Container>
      </Box>
    </Layout>
  );
};

export default Home;
