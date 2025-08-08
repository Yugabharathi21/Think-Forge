import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Divider,
  Link,
  useTheme
} from '@mui/material';
import {
  Close as CloseIcon,
  PlayArrow as PlayIcon,
  OpenInNew as OpenInNewIcon,
  AccessTime as TimeIcon,
  Visibility as ViewIcon,
  Person as ChannelIcon
} from '@mui/icons-material';
import { youtubeService, YouTubeVideo } from '@/lib/youtube';

const videoTypes = [
  { type: 'tutorial' as const, label: 'Tutorials', icon: '🎓' },
  { type: 'explanation' as const, label: 'Explanations', icon: '💡' },
  { type: 'course' as const, label: 'Courses', icon: '📚' },
  { type: 'overview' as const, label: 'Overview', icon: '🔍' }
];

interface YouTubeVideoModalProps {
  open: boolean;
  onClose: () => void;
  topic: string;
  nodeTitle?: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`youtube-tabpanel-${index}`}
      aria-labelledby={`youtube-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export const YouTubeVideoModal: React.FC<YouTubeVideoModalProps> = ({
  open,
  onClose,
  topic,
  nodeTitle
}) => {
  const theme = useTheme();
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<YouTubeVideo | null>(null);
  const [tabValue, setTabValue] = useState(0);

  const [videosByType, setVideosByType] = useState<{ [key: string]: YouTubeVideo[] }>({});

  const fetchAllVideoTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    const newVideosByType: { [key: string]: YouTubeVideo[] } = {};

    try {
      // Fetch videos for each type
      for (const videoType of videoTypes) {
        try {
          const result = await youtubeService.searchVideos(topic, 6, videoType.type);
          newVideosByType[videoType.type] = result.videos;
        } catch (err) {
          console.error(`Error fetching ${videoType.type} videos:`, err);
          newVideosByType[videoType.type] = [];
        }
      }
      
      setVideosByType(newVideosByType);
      // Set the first tab's videos as default
      setVideos(newVideosByType[videoTypes[0].type] || []);
    } catch (err) {
      setError('Failed to fetch videos. Please try again.');
      console.error('Error fetching videos:', err);
    } finally {
      setLoading(false);
    }
  }, [topic]);

  useEffect(() => {
    if (open && topic) {
      fetchAllVideoTypes();
    }
  }, [open, topic, fetchAllVideoTypes]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    const selectedType = videoTypes[newValue].type;
    setVideos(videosByType[selectedType] || []);
    setSelectedVideo(null);
  };

  const formatPublishedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const VideoCard = ({ video }: { video: YouTubeVideo }) => (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        }
      }}
      onClick={() => setSelectedVideo(video)}
    >
      <CardMedia
        component="img"
        height="140"
        image={video.thumbnailUrl}
        alt={video.title}
        sx={{ position: 'relative' }}
      />
      <CardContent sx={{ flexGrow: 1, p: 2 }}>
        <Typography variant="subtitle2" component="div" sx={{ 
          fontWeight: 600,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          mb: 1,
          lineHeight: 1.4
        }}>
          {video.title}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <ChannelIcon sx={{ fontSize: 14, mr: 0.5, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary" sx={{ 
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {video.channelTitle}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {video.duration && (
            <Chip 
              icon={<TimeIcon />} 
              label={video.duration} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
          {video.viewCount && (
            <Chip 
              icon={<ViewIcon />} 
              label={video.viewCount} 
              size="small" 
              variant="outlined"
              sx={{ fontSize: '0.7rem' }}
            />
          )}
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
          {formatPublishedDate(video.publishedAt)}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          minHeight: '80vh',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 2
      }}>
        <Box>
          <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
            YouTube Videos: {nodeTitle || topic}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Educational content related to this topic
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        {selectedVideo ? (
          // Video Player View
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Button
                startIcon={<CloseIcon />}
                onClick={() => setSelectedVideo(null)}
                size="small"
              >
                Back to Videos
              </Button>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  startIcon={<OpenInNewIcon />}
                  href={youtubeService.getWatchUrl(selectedVideo.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  size="small"
                >
                  Open in YouTube
                </Button>
              </Box>
            </Box>

            <Box sx={{ 
              position: 'relative', 
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              mb: 2,
              borderRadius: 2,
              overflow: 'hidden'
            }}>
              <iframe
                src={youtubeService.getEmbedUrl(selectedVideo.id)}
                title={selectedVideo.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </Box>

            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              {selectedVideo.title}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Chip icon={<ChannelIcon />} label={selectedVideo.channelTitle} />
              {selectedVideo.duration && (
                <Chip icon={<TimeIcon />} label={selectedVideo.duration} variant="outlined" />
              )}
              {selectedVideo.viewCount && (
                <Chip icon={<ViewIcon />} label={selectedVideo.viewCount} variant="outlined" />
              )}
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 4,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.6
            }}>
              {selectedVideo.description}
            </Typography>
          </Box>
        ) : (
          // Video Grid View
          <Box>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              sx={{ mb: 2 }}
            >
              {videoTypes.map((type, index) => (
                <Tab 
                  key={type.type}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{type.icon}</span>
                      {type.label}
                    </Box>
                  }
                />
              ))}
            </Tabs>

            <Divider sx={{ mb: 3 }} />

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            ) : videos.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No videos found for "{topic}"
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {videos.map((video) => (
                  <Grid item xs={12} sm={6} md={4} key={video.id}>
                    <VideoCard video={video} />
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default YouTubeVideoModal;
