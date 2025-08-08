import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Chip
} from '@mui/material';
import { YouTube } from '@mui/icons-material';
import Layout from '@/components/layout/Layout';
import YouTubeVideoModal from '@/components/youtube/YouTubeVideoModal';

const YouTubeDemoPage = () => {
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const demoTopics = [
    { title: 'React Hooks', description: 'Learn React hooks in depth' },
    { title: 'JavaScript Promises', description: 'Master asynchronous JavaScript' },
    { title: 'Python Data Science', description: 'Data analysis with Python' },
    { title: 'Machine Learning', description: 'Introduction to ML concepts' },
    { title: 'Web Design', description: 'UI/UX design principles' },
    { title: 'Database Design', description: 'SQL and database modeling' },
  ];

  const openYouTubeModal = (topic: string) => {
    setSelectedTopic(topic);
    setYoutubeModalOpen(true);
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom fontWeight="bold">
            🎥 YouTube Learning Integration Demo
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
            Click on any topic below to discover educational YouTube videos
          </Typography>
        </Box>

        <Grid container spacing={3}>
          {demoTopics.map((topic, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {topic.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {topic.description}
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<YouTube />}
                    onClick={() => openYouTubeModal(topic.title)}
                    sx={{
                      background: 'linear-gradient(45deg, #FF5722 30%, #FF9800 90%)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #F44336 30%, #FF5722 90%)',
                      }
                    }}
                    fullWidth
                  >
                    Watch Videos
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 6, p: 4, bgcolor: 'background.paper', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            🚀 How It Works
          </Typography>
          <Typography variant="body1" paragraph>
            Our YouTube integration fetches educational content in multiple categories:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
            <Chip label="🎓 Tutorials" color="primary" />
            <Chip label="💡 Explanations" color="secondary" />
            <Chip label="📚 Courses" color="success" />
            <Chip label="🔍 Overviews" color="warning" />
          </Box>
          <Typography variant="body2" color="text.secondary">
            Each category provides different types of learning content to match your learning style and current knowledge level.
          </Typography>
        </Box>

        <YouTubeVideoModal
          open={youtubeModalOpen}
          onClose={() => setYoutubeModalOpen(false)}
          topic={selectedTopic}
        />
      </Container>
    </Layout>
  );
};

export default YouTubeDemoPage;
