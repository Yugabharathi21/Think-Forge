
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  Tabs, 
  Tab,
  Card, 
  CardContent, 
  Button,
  Divider,
  IconButton,
  useTheme,
  CircularProgress
} from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Layout from '@/components/layout/Layout';
import { useTheme as useAppTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { quizService } from '@/lib/database';
import { WeeklyProgressPoint, SubjectDataPoint, TopicDataPoint, QuizSession } from '@/lib/supabase';

// Fallback data if needed
const COLORS = ['#7E22CE', '#9B87F5', '#E5DEFF', '#4C1D95', '#2E1065'];

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
    name: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
  const theme = useTheme();
  
  if (active && payload && payload.length) {
    return (
      <Paper 
        elevation={3} 
        sx={{ 
          p: 1.5, 
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.9)',
          border: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Typography variant="caption" fontWeight="medium">
          {`${label}: ${payload[0].value}`}
        </Typography>
      </Paper>
    );
  }

  return null;
};

const Progress = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const [tabValue, setTabValue] = useState(0);
  const theme = useTheme();
  const { mode } = useAppTheme();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Chart data state
  const [weeklyProgress, setWeeklyProgress] = useState<WeeklyProgressPoint[]>([]);
  const [subjectDistribution, setSubjectDistribution] = useState<SubjectDataPoint[]>([]);
  const [strengthsData, setStrengthsData] = useState<TopicDataPoint[]>([]);
  const [weaknessesData, setWeaknessesData] = useState<TopicDataPoint[]>([]);
  const [recentActivity, setRecentActivity] = useState<QuizSession[]>([]);
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalQuestions: 0,
    averageScore: 0
  });

  useEffect(() => {
    const fetchProgressData = async () => {
      if (!user) {
        setError("Please log in to view your progress");
        setLoading(false);
        return;
      }

      try {
        console.log('📊 Fetching progress data for user:', user.id);
        setLoading(true);
        
        const chartData = await quizService.getProgressChartData(user.id);
        
        // Update state with real data
        setWeeklyProgress(chartData.weeklyProgress);
        setSubjectDistribution(chartData.subjectDistribution);
        setStrengthsData(chartData.topicStrengths);
        setWeaknessesData(chartData.topicWeaknesses);
        setRecentActivity(chartData.recentActivity);
        setStats({
          totalSessions: chartData.totalSessions,
          totalQuestions: chartData.totalQuestions,
          averageScore: chartData.averageScore
        });
        
        console.log('✅ Progress data loaded successfully', chartData);
      } catch (err) {
        console.error('❌ Error fetching progress data:', err);
        setError("Failed to load progress data");
      } finally {
        setLoading(false);
      }
    };

    fetchProgressData();
  }, [user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Layout>
      <Box sx={{ pb: 5 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Progress Report</Typography>
        
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '200px'
          }}>
            <CircularProgress color="primary" />
          </Box>
        ) : error ? (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: mode === 'dark' ? 'rgba(211, 47, 47, 0.1)' : 'rgba(211, 47, 47, 0.05)',
              border: '1px solid',
              borderColor: mode === 'dark' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(211, 47, 47, 0.15)'
            }}
          >
            <Typography variant="h6" color="error" gutterBottom>
              {error}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Please log in to view your progress statistics.
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Stats Overview */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Total Sessions</Typography>
                      <Typography variant="h5" fontWeight="bold">{stats.totalSessions}</Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        opacity: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CalendarMonthIcon sx={{ color: 'primary.main' }} />
                    </Box>
                  </Box>
                  {stats.totalSessions > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                      <Typography variant="caption" color="success.main">
                        {stats.totalSessions > 10 ? "Regular practice!" : "Keep it up!"}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Estimated Study Hours</Typography>
                      <Typography variant="h5" fontWeight="bold">
                        {(stats.totalSessions * 0.25).toFixed(1)}
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        opacity: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <AccessTimeIcon sx={{ color: 'primary.main' }} />
                    </Box>
                  </Box>
                  {stats.totalSessions > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <Typography variant="caption" color="text.secondary">
                        Based on your quiz activity
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Average Score</Typography>
                      <Typography variant="h5" fontWeight="bold">{stats.averageScore}%</Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        opacity: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <EmojiEventsIcon sx={{ color: 'primary.main' }} />
                    </Box>
                  </Box>
                  {stats.averageScore > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <KeyboardArrowUpIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: stats.averageScore > 70 ? 'success.main' : 'warning.main', 
                          mr: 0.5 
                        }} 
                      />
                      <Typography 
                        variant="caption" 
                        color={stats.averageScore > 70 ? 'success.main' : 'warning.main'}
                      >
                        {stats.averageScore > 90 ? 'Excellent!' : 
                          stats.averageScore > 80 ? 'Great job!' : 
                          stats.averageScore > 70 ? 'Good progress!' : 
                          'Keep practicing!'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    p: 2, 
                    borderRadius: 2,
                    background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Questions Answered</Typography>
                      <Typography variant="h5" fontWeight="bold">{stats.totalQuestions}</Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        bgcolor: 'primary.main', 
                        opacity: 0.2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <BarChartIcon sx={{ color: 'primary.main' }} />
                    </Box>
                  </Box>
                  {stats.totalQuestions > 0 && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                      <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                      <Typography variant="caption" color="success.main">
                        {stats.totalQuestions > 100 ? 'Power learner!' : 'Making progress!'}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </>
        )}
        
        {/* Tabs for Different Charts */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Paper 
            sx={{ 
              borderRadius: 2,
              background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              mb: 3
            }}
          >
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab 
                label="Overview" 
                sx={{ 
                  '&.Mui-selected': { 
                    color: 'primary.main',
                    bgcolor: mode === 'dark' ? 'rgba(134, 26, 255, 0.1)' : 'rgba(134, 26, 255, 0.05)' 
                  }
                }} 
              />
              <Tab 
                label="Strengths" 
                sx={{ 
                  '&.Mui-selected': { 
                    color: 'primary.main',
                    bgcolor: mode === 'dark' ? 'rgba(134, 26, 255, 0.1)' : 'rgba(134, 26, 255, 0.05)' 
                  }
                }} 
              />
              <Tab 
                label="Areas to Improve" 
                sx={{ 
                  '&.Mui-selected': { 
                    color: 'primary.main',
                    bgcolor: mode === 'dark' ? 'rgba(134, 26, 255, 0.1)' : 'rgba(134, 26, 255, 0.05)' 
                  }
                }} 
              />
            </Tabs>
          </Paper>
          
          {/* Overview Tab Content */}
          <Box sx={{ display: tabValue === 0 ? 'block' : 'none' }}>
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight="medium">Progress Over Time</Typography>
                    <ShowChartIcon sx={{ color: 'primary.main' }} />
                  </Box>
                  <Box sx={{ height: 320 }}>
                    {weeklyProgress.length === 0 ? (
                      <Box sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        <Typography variant="body1" color="text.secondary" align="center">
                          No progress data available yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Complete more quizzes to see your progress over time.
                        </Typography>
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={weeklyProgress}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid 
                            strokeDasharray="3 3" 
                            stroke={mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                          />
                          <XAxis 
                            dataKey="name" 
                            stroke={mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
                            fontSize={12} 
                          />
                          <YAxis 
                            stroke={mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
                            fontSize={12} 
                          />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Bar 
                            dataKey="score" 
                            fill={theme.palette.primary.main}
                            radius={[4, 4, 0, 0]}
                            background={{ fill: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} lg={6}>
                <Paper 
                  elevation={2}
                  sx={{ 
                    p: 3, 
                    borderRadius: 2,
                    background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: 'divider'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" fontWeight="medium">Subject Distribution</Typography>
                    <PieChartIcon sx={{ color: 'primary.main' }} />
                  </Box>
                  <Box sx={{ height: 320 }}>
                    {subjectDistribution.length === 0 ? (
                      <Box sx={{ 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        flexDirection: 'column',
                        gap: 2
                      }}>
                        <Typography variant="body1" color="text.secondary" align="center">
                          No subject data available yet.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" align="center">
                          Complete quizzes in different subjects to see your distribution.
                        </Typography>
                      </Box>
                    ) : (
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={subjectDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            fill="#8884d8"
                            paddingAngle={5}
                            dataKey="value"
                            label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                            labelLine={false}
                          >
                            {subjectDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
          
          {/* Strengths Tab Content */}
          <Box sx={{ display: tabValue === 1 ? 'block' : 'none' }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="medium">Your Strongest Areas</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main',
                      mr: 1
                    }} 
                  />
                  <Typography variant="body2" color="success.main">High Performance</Typography>
                </Box>
              </Box>
              <Box sx={{ height: 320 }}>
                {strengthsData.length === 0 ? (
                  <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <Typography variant="body1" color="text.secondary" align="center">
                      No strength data available yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Complete more quizzes to identify your strong areas.
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={strengthsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                      />
                      <XAxis 
                        dataKey="name" 
                        stroke={mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
                        fontSize={12} 
                      />
                      <YAxis 
                        stroke={mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
                        fontSize={12} 
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="score" 
                        fill={theme.palette.success.main}
                        radius={[4, 4, 0, 0]}
                        background={{ fill: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>AI Insights</Typography>
                <Typography variant="body2" color="text.secondary">
                  {strengthsData.length > 0 
                    ? `You excel particularly in ${strengthsData[0]?.name || 'certain topics'}. Consider exploring advanced topics in these areas or helping other students to reinforce your knowledge.`
                    : 'Complete more quizzes to receive personalized insights about your strengths.'}
                </Typography>
              </Box>
            </Paper>
          </Box>
          
          {/* Weaknesses Tab Content */}
          <Box sx={{ display: tabValue === 2 ? 'block' : 'none' }}>
            <Paper 
              elevation={2}
              sx={{ 
                p: 3, 
                borderRadius: 2,
                background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(10px)',
                border: '1px solid',
                borderColor: 'divider'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight="medium">Areas to Improve</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 12, 
                      height: 12, 
                      borderRadius: '50%', 
                      bgcolor: 'error.main',
                      mr: 1
                    }} 
                  />
                  <Typography variant="body2" color="error.main">Needs Attention</Typography>
                </Box>
              </Box>
              <Box sx={{ height: 320 }}>
                {weaknessesData.length === 0 ? (
                  <Box sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    flexDirection: 'column',
                    gap: 2
                  }}>
                    <Typography variant="body1" color="text.secondary" align="center">
                      No improvement data available yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      Complete more quizzes to identify areas for improvement.
                    </Typography>
                  </Box>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={weaknessesData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke={mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'} 
                      />
                      <XAxis 
                        dataKey="name" 
                        stroke={mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
                        fontSize={12} 
                      />
                      <YAxis 
                        stroke={mode === 'dark' ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)'} 
                        fontSize={12} 
                      />
                      <RechartsTooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="score" 
                        fill={theme.palette.error.main}
                        radius={[4, 4, 0, 0]}
                        background={{ fill: mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>AI Recommendations</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Focus on strengthening your understanding of Organic Chemistry and Quantum Physics. We recommend scheduling focused study sessions with our AI tutor to practice these concepts.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    sx={{ 
                      textTransform: 'none',
                      background: mode === 'dark' ? 'rgba(134, 26, 255, 0.2)' : 'rgba(134, 26, 255, 0.1)',
                      color: 'primary.main',
                      '&:hover': {
                        background: mode === 'dark' ? 'rgba(134, 26, 255, 0.3)' : 'rgba(134, 26, 255, 0.2)',
                      }
                    }}
                  >
                    Schedule Targeted Practice
                  </Button>
                </Box>
              </Box>
            </Paper>
          </Box>
        </Box>
        
        {!loading && !error && (
          <Paper 
            elevation={2}
            sx={{ 
              p: 3, 
              borderRadius: 2,
              background: mode === 'dark' ? 'rgba(30,30,30,0.6)' : 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(10px)',
              border: '1px solid',
              borderColor: 'divider',
              mt: 4
            }}
          >
            <Typography variant="h6" fontWeight="medium" sx={{ mb: 2 }}>Recent Activity</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {recentActivity.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                  No recent activity. Complete your first quiz to see your activity here!
                </Typography>
              ) : (
                recentActivity.map((session, idx) => {
                  const date = new Date(session.completed_at);
                  const now = new Date();
                  const diffTime = Math.abs(now.getTime() - date.getTime());
                  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                  const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
                  const diffMinutes = Math.floor(diffTime / (1000 * 60));
                  
                  let timeAgo = '';
                  if (diffDays > 0) {
                    timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                  } else if (diffHours > 0) {
                    timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
                  } else {
                    timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
                  }
                  
                  return (
                    <Paper 
                      key={session.id} 
                      elevation={1}
                      sx={{ 
                        p: 2, 
                        borderRadius: 2,
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        background: mode === 'dark' ? 'rgba(20,20,20,0.6)' : 'rgba(245,245,245,0.9)',
                      }}
                    >
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {session.subject} Quiz {session.difficulty ? `(${session.difficulty})` : ''}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          Completed {timeAgo}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="body2" fontWeight="medium">{session.score}%</Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                          {session.total_questions} questions
                        </Typography>
                      </Box>
                    </Paper>
                  );
                })
              )}
            </Box>
          </Paper>
        )}
      </Box>
    </Layout>
  );
};

export default Progress;
