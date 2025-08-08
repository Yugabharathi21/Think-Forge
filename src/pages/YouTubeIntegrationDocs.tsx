import React from 'react';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Alert,
  Paper,
  Code
} from '@mui/material';
import {
  YouTube,
  OndemandVideo,
  AccountTree,
  School,
  PlayArrow,
  CheckCircle,
  Star,
  Speed,
  Security,
  Language
} from '@mui/icons-material';
import Layout from '@/components/layout/Layout';

const YouTubeIntegrationDocs = () => {
  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            🎥 YouTube Learning Integration
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
            Seamlessly discover educational content for any flowchart topic
          </Typography>
          <Chip 
            label="API Integrated" 
            color="success" 
            icon={<CheckCircle />}
            sx={{ mr: 1 }}
          />
          <Chip 
            label="Real-time Fetching" 
            color="primary" 
            icon={<Speed />}
          />
        </Box>

        {/* How It Works */}
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <YouTube color="error" />
              How It Works
            </Typography>
            <Typography variant="body1" paragraph sx={{ fontSize: '1.1rem', lineHeight: 1.7 }}>
              Our YouTube integration allows users to instantly access educational content related to any node or topic in their flowcharts. 
              When you click on a flowchart node or featured topic card, the system intelligently searches YouTube for relevant tutorials, 
              explanations, and courses.
            </Typography>
            
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'primary.main', color: 'white', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    🎯 Smart Query Enhancement
                  </Typography>
                  <Typography variant="body2">
                    Each search query is enhanced based on the content type:
                    <br />• Tutorial: "topic tutorial step by step"
                    <br />• Explanation: "topic explained simply"
                    <br />• Course: "topic complete course"
                    <br />• Overview: "topic overview introduction"
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, bgcolor: 'secondary.main', color: 'white', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    📊 Organized Results
                  </Typography>
                  <Typography variant="body2">
                    Videos are categorized into 4 tabs:
                    <br />• 🎓 Tutorials (hands-on learning)
                    <br />• 💡 Explanations (concept clarification)
                    <br />• 📚 Courses (comprehensive study)
                    <br />• 🔍 Overview (introductory content)
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Features */}
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Star color="warning" />
              Key Features
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <OndemandVideo sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Embedded Player
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Watch videos directly in the app without leaving your learning flow
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Language sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Multi-Category Search
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Find content across tutorials, explanations, courses, and overviews
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                  <Security sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Real YouTube API
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Uses official YouTube Data API v3 for reliable, up-to-date content
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Integration Points */}
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <AccountTree color="primary" />
              Integration Points
            </Typography>
            
            <List>
              <ListItem>
                <ListItemIcon>
                  <PlayArrow color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary="Flowchart Node Dialog"
                  secondary="Click any node in a flowchart to open its information dialog, then click 'Watch YouTube Tutorials' to find related content"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <School color="secondary" />
                </ListItemIcon>
                <ListItemText
                  primary="Featured Topic Cards"
                  secondary="Each featured topic in the Flowchart Studio has a 'Watch Videos' button for instant educational content discovery"
                />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <OndemandVideo color="success" />
                </ListItemIcon>
                <ListItemText
                  primary="Contextual Learning"
                  secondary="Videos are fetched based on the specific node label or topic, ensuring highly relevant educational content"
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card sx={{ mb: 4, borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              🔧 Technical Implementation
            </Typography>
            
            <Alert severity="info" sx={{ mb: 3 }}>
              <Typography variant="body2">
                The integration uses YouTube Data API v3 to fetch educational content with proper error handling and rate limiting.
              </Typography>
            </Alert>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Core Components:
            </Typography>
            
            <Box sx={{ pl: 2, mb: 3 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                📁 src/lib/youtube.ts - YouTube API service
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', mb: 1 }}>
                📁 src/components/youtube/YouTubeVideoModal.tsx - Video display modal
              </Typography>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                📁 Integration points in FlowchartViewer and FlowchartStudio
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" gutterBottom>
              API Configuration:
            </Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                Base URL: https://www.googleapis.com/youtube/v3
                <br />
                API Key: Configured in youtube.ts service
                <br />
                Max Results: 6 videos per category (24 total)
                <br />
                Order: relevance (most relevant content first)
              </Typography>
            </Paper>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card sx={{ borderRadius: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h4" gutterBottom>
              💡 Usage Examples
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, border: '2px solid', borderColor: 'primary.main' }}>
                  <Typography variant="h6" color="primary" gutterBottom>
                    Scenario 1: Learning React Hooks
                  </Typography>
                  <Typography variant="body2" paragraph>
                    1. Generate a "React Development" flowchart
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Click on the "useState Hook" node
                  </Typography>
                  <Typography variant="body2" paragraph>
                    3. Click "Watch YouTube Tutorials"
                  </Typography>
                  <Typography variant="body2">
                    4. Browse tutorials, explanations, and courses about React hooks
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: 2, border: '2px solid', borderColor: 'secondary.main' }}>
                  <Typography variant="h6" color="secondary" gutterBottom>
                    Scenario 2: Data Science Study Plan
                  </Typography>
                  <Typography variant="body2" paragraph>
                    1. Select "Data Science" from featured topics
                  </Typography>
                  <Typography variant="body2" paragraph>
                    2. Click "Watch Videos" on the topic card
                  </Typography>
                  <Typography variant="body2" paragraph>
                    3. Explore overview videos to understand the field
                  </Typography>
                  <Typography variant="body2">
                    4. Switch to "Courses" tab for comprehensive learning paths
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
};

export default YouTubeIntegrationDocs;
