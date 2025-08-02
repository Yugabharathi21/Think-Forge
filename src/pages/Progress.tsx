
import { useState } from 'react';
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
  useTheme
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

const subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'History'];
const COLORS = ['#7E22CE', '#9B87F5', '#E5DEFF', '#4C1D95', '#2E1065'];

const strengthsData = [
  { name: 'Algebra', score: 85 },
  { name: 'Calculus', score: 78 },
  { name: 'Algorithms', score: 92 },
  { name: 'Data Structures', score: 88 },
  { name: 'Statistics', score: 72 },
];

const weaknessesData = [
  { name: 'Quantum Physics', score: 45 },
  { name: 'Organic Chemistry', score: 38 },
  { name: 'Ancient History', score: 52 },
  { name: 'Trigonometry', score: 60 },
  { name: 'Thermodynamics', score: 55 },
];

const progressData = [
  { name: 'Week 1', score: 45 },
  { name: 'Week 2', score: 52 },
  { name: 'Week 3', score: 58 },
  { name: 'Week 4', score: 65 },
  { name: 'Week 5', score: 72 },
  { name: 'Week 6', score: 78 },
  { name: 'Week 7', score: 85 },
];

const subjectDistributionData = subjects.map((subject, index) => ({
  name: subject,
  value: Math.floor(Math.random() * 40) + 10, // Random value between 10 and 50
}));

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

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Layout>
      <Box sx={{ pb: 5 }}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>Progress Report</Typography>
        
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
                  <Typography variant="h5" fontWeight="bold">24</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">12% increase</Typography>
              </Box>
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
                  <Typography variant="body2" color="text.secondary">Study Hours</Typography>
                  <Typography variant="h5" fontWeight="bold">38.5</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">8% increase</Typography>
              </Box>
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
                  <Typography variant="h5" fontWeight="bold">78%</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">5% increase</Typography>
              </Box>
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
                  <Typography variant="h5" fontWeight="bold">246</Typography>
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
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <KeyboardArrowUpIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="success.main">18% increase</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
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
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={progressData}
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
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={subjectDistributionData}
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
                          {subjectDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip content={<CustomTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
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
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="primary.main" gutterBottom>AI Insights</Typography>
                <Typography variant="body2" color="text.secondary">
                  You excel particularly in Algorithm concepts and Data Structures. Consider exploring advanced topics in these areas or helping other students to reinforce your knowledge.
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
        
        {/* Recent Activity */}
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
            {[...Array(5)].map((_, idx) => (
              <Paper 
                key={idx} 
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
                    {['Mathematics Quiz', 'Physics Problem Set', 'Computer Science Practice', 'Chemistry Concepts', 'History Timeline'][idx]}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    Completed {['2 hours', '1 day', '3 days', '5 days', '1 week'][idx]} ago
                  </Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="body2" fontWeight="medium">{[85, 72, 90, 68, 76][idx]}%</Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {[17, 15, 20, 25, 12][idx]} questions
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
};

export default Progress;
