
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Award, BarChart2, PieChart as PieChartIcon, LineChart, ArrowUp, ArrowDown } from 'lucide-react';
import Layout from '@/components/layout/Layout';

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

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-dark p-3 border border-white/10 rounded-lg shadow-lg">
        <p className="text-xs font-medium">{`${label}: ${payload[0].value}`}</p>
      </div>
    );
  }

  return null;
};

const Progress = () => {
  const [timeframe, setTimeframe] = useState('weekly');

  return (
    <Layout>
      <div className="pb-10">
        <h1 className="text-2xl font-bold mb-6">Progress Report</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Total Sessions</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-thinkforge-purple/20 flex items-center justify-center">
                <Calendar className="h-5 w-5 text-thinkforge-purple" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>12% increase</span>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Study Hours</p>
                <p className="text-2xl font-bold">38.5</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-thinkforge-purple/20 flex items-center justify-center">
                <Clock className="h-5 w-5 text-thinkforge-purple" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>8% increase</span>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Average Score</p>
                <p className="text-2xl font-bold">78%</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-thinkforge-purple/20 flex items-center justify-center">
                <Award className="h-5 w-5 text-thinkforge-purple" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>5% increase</span>
            </div>
          </div>
          
          <div className="glass-card p-4 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground/70">Questions Answered</p>
                <p className="text-2xl font-bold">246</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-thinkforge-purple/20 flex items-center justify-center">
                <BarChart2 className="h-5 w-5 text-thinkforge-purple" />
              </div>
            </div>
            <div className="flex items-center mt-2 text-xs text-green-400">
              <ArrowUp className="h-3 w-3 mr-1" />
              <span>18% increase</span>
            </div>
          </div>
        </div>
        
        {/* Tabs for Different Charts */}
        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="glass-dark mb-4">
            <TabsTrigger value="overview" className="data-[state=active]:bg-thinkforge-purple/20 data-[state=active]:text-thinkforge-violet">
              Overview
            </TabsTrigger>
            <TabsTrigger value="strengths" className="data-[state=active]:bg-thinkforge-purple/20 data-[state=active]:text-thinkforge-violet">
              Strengths
            </TabsTrigger>
            <TabsTrigger value="weaknesses" className="data-[state=active]:bg-thinkforge-purple/20 data-[state=active]:text-thinkforge-violet">
              Areas to Improve
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Progress Over Time</h3>
                  <LineChart className="h-5 w-5 text-thinkforge-purple" />
                </div>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={progressData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar 
                        dataKey="score" 
                        fill="#7E22CE"
                        radius={[4, 4, 0, 0]}
                        background={{ fill: 'rgba(255,255,255,0.05)' }}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Subject Distribution</h3>
                  <PieChartIcon className="h-5 w-5 text-thinkforge-purple" />
                </div>
                <div className="h-80">
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
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="strengths">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Your Strongest Areas</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                  <span className="text-sm text-green-400">High Performance</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={strengthsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="score" 
                      fill="#10B981" // Green color
                      radius={[4, 4, 0, 0]}
                      background={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2 text-thinkforge-violet">AI Insights</h4>
                <p className="text-sm text-foreground/80">
                  You excel particularly in Algorithm concepts and Data Structures. Consider exploring advanced topics in these areas or helping other students to reinforce your knowledge.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="weaknesses">
            <div className="glass-card p-6 rounded-xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Areas to Improve</h3>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                  <span className="text-sm text-red-400">Needs Attention</span>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={weaknessesData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar 
                      dataKey="score" 
                      fill="#F87171" // Red color
                      radius={[4, 4, 0, 0]}
                      background={{ fill: 'rgba(255,255,255,0.05)' }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-6">
                <h4 className="text-sm font-medium mb-2 text-thinkforge-violet">AI Recommendations</h4>
                <p className="text-sm text-foreground/80">
                  Focus on strengthening your understanding of Organic Chemistry and Quantum Physics. We recommend scheduling focused study sessions with our AI tutor to practice these concepts.
                </p>
                <div className="mt-4 flex justify-end">
                  <button className="text-sm px-4 py-2 bg-thinkforge-purple/20 hover:bg-thinkforge-purple/30 text-thinkforge-violet rounded-md transition-colors">
                    Schedule Targeted Practice
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Recent Activity */}
        <div className="glass-card p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {[...Array(5)].map((_, idx) => (
              <div key={idx} className="glass-dark p-4 rounded-lg flex justify-between items-center">
                <div>
                  <h4 className="text-sm font-medium">
                    {['Mathematics Quiz', 'Physics Problem Set', 'Computer Science Practice', 'Chemistry Concepts', 'History Timeline'][idx]}
                  </h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Completed {['2 hours', '1 day', '3 days', '5 days', '1 week'][idx]} ago
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{[85, 72, 90, 68, 76][idx]}%</p>
                  <p className="text-xs text-foreground/70 mt-1">
                    {[17, 15, 20, 25, 12][idx]} questions
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Progress;
