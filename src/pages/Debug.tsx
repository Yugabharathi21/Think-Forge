import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Database, Brain, User, Youtube, Video, Settings, Zap } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import YouTubeVideoModal from '@/components/youtube/YouTubeVideoModal';
import FlowchartViewer from '@/components/flowchart/FlowchartViewer';
import { testDatabaseConnection } from '@/lib/database';
import { generateQuizQuestions } from '@/lib/ollama';
import { flowchartService, StudyPlan } from '@/lib/flowchart';
import { useAuth } from '@/contexts/AuthContext';

const Debug = () => {
  const { user, isAuthenticated } = useAuth();
  const [tests, setTests] = useState<{
    db: boolean | null;
    ollama: boolean | null;
    generation: boolean | null;
  }>({
    db: null,
    ollama: null,
    generation: null,
  });
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [youtubeModalOpen, setYoutubeModalOpen] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');
  
  // Flowchart testing state
  const [flowchartTopic, setFlowchartTopic] = useState('');
  const [flowchartType, setFlowchartType] = useState<'study-plan' | 'mind-map'>('study-plan');
  const [flowchartComplexity, setFlowchartComplexity] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [isGeneratingFlowchart, setIsGeneratingFlowchart] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<StudyPlan | null>(null);
  const [flowchartError, setFlowchartError] = useState<string | null>(null);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
    console.log(message);
  };

  const testDatabase = async () => {
    setLoading(true);
    addLog('🔄 Testing database connection...');
    
    try {
      const result = await testDatabaseConnection();
      setTests(prev => ({ ...prev, db: result }));
      addLog(result ? '✅ Database connected' : '❌ Database failed');
    } catch (error) {
      setTests(prev => ({ ...prev, db: false }));
      addLog(`❌ Database error: ${error}`);
    }
    
    setLoading(false);
  };

  const testOllama = async () => {
    setLoading(true);
    addLog('🔄 Testing Ollama connection...');
    
    try {
      const response = await fetch('http://localhost:11434/api/tags');
      const success = response.ok;
      
      if (success) {
        const data = await response.json();
        addLog(`✅ Ollama connected - Models: ${data.models?.map((m: { name: string }) => m.name).join(', ')}`);
      } else {
        addLog(`❌ Ollama failed - Status: ${response.status}`);
      }
      
      setTests(prev => ({ ...prev, ollama: success }));
    } catch (error) {
      setTests(prev => ({ ...prev, ollama: false }));
      addLog(`❌ Ollama error: ${error}`);
    }
    
    setLoading(false);
  };

  const testGeneration = async () => {
    setLoading(true);
    addLog('🔄 Testing AI question generation...');
    
    try {
      const questions = await generateQuizQuestions('Mathematics', 2, 'easy');
      const success = questions.length > 0;
      
      setTests(prev => ({ ...prev, generation: success }));
      addLog(success ? 
        `✅ Generated ${questions.length} questions` : 
        '❌ Question generation failed'
      );
      
      if (success) {
        addLog(`📄 Sample question: ${questions[0].question}`);
      }
    } catch (error) {
      setTests(prev => ({ ...prev, generation: false }));
      addLog(`❌ Generation error: ${error}`);
    }
    
    setLoading(false);
  };

  const runAllTests = async () => {
    setLogs([]);
    addLog('🚀 Starting comprehensive system test...');
    
    await testDatabase();
    await testOllama();
    await testGeneration();
    
    // Test flowchart generation
    addLog('🔄 Testing flowchart generation...');
    await testFlowchartGeneration('React Development', 'study-plan', 'intermediate');
    
    addLog('✅ All tests completed');
  };

  const testFlowchartGeneration = async (topic: string, type: 'study-plan' | 'mind-map' = 'study-plan', complexity: 'beginner' | 'intermediate' | 'advanced' = 'intermediate') => {
    setIsGeneratingFlowchart(true);
    setFlowchartError(null);
    setGeneratedPlan(null);
    addLog(`🔄 Testing flowchart generation for "${topic}"...`);

    try {
      let plan: StudyPlan;
      const options = { complexity, fastMode: true };
      
      if (type === 'mind-map') {
        plan = await flowchartService.generateMindMap(topic, options);
      } else {
        plan = await flowchartService.generateStudyPlan(topic, options);
      }
      
      setGeneratedPlan(plan);
      addLog(`✅ Successfully generated ${type} with ${plan.nodes.length} nodes`);
    } catch (err) {
      setFlowchartError('Failed to generate flowchart. Please try again.');
      addLog(`❌ Flowchart generation failed: ${err}`);
    } finally {
      setIsGeneratingFlowchart(false);
    }
  };

  const StatusBadge = ({ status }: { status: boolean | null }) => {
    if (status === null) return <Badge variant="secondary">Not Tested</Badge>;
    return status ? 
      <Badge variant="default" className="bg-green-600"><CheckCircle className="w-4 h-4 mr-1" />Connected</Badge> :
      <Badge variant="destructive"><XCircle className="w-4 h-4 mr-1" />Failed</Badge>;
  };

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">System Debug Dashboard</h1>
          <p className="text-muted-foreground">Test and debug all system components</p>
        </div>

        {/* Authentication Status */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Authentication Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <StatusBadge status={isAuthenticated} />
              {user ? (
                <span className="text-sm">Logged in as: {user.email}</span>
              ) : (
                <span className="text-sm text-muted-foreground">Not logged in</span>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatusBadge status={tests.db} />
                <Button onClick={testDatabase} disabled={loading} size="sm" className="w-full">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Ollama AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatusBadge status={tests.ollama} />
                <Button onClick={testOllama} disabled={loading} size="sm" className="w-full">
                  Test Connection
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Generation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <StatusBadge status={tests.generation} />
                <Button onClick={testGeneration} disabled={loading} size="sm" className="w-full">
                  Test Generation
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run comprehensive system tests</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={runAllTests} disabled={loading} className="mr-2">
              {loading ? 'Testing...' : 'Run All Tests'}
            </Button>
            <Button onClick={() => setLogs([])} variant="outline">
              Clear Logs
            </Button>
          </CardContent>
        </Card>

        {/* YouTube Integration Demo */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Youtube className="w-5 h-5 text-red-500" />
              YouTube Integration Demo
            </CardTitle>
            <CardDescription>Test YouTube video fetching functionality</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                'React Hooks',
                'JavaScript Promises', 
                'Python Data Science',
                'Machine Learning',
                'Web Design',
                'Database Design',
                'Node.js',
                'TypeScript'
              ].map((topic) => (
                <Button
                  key={topic}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setYoutubeModalOpen(true);
                    addLog(`🎥 Opening YouTube videos for: ${topic}`);
                  }}
                  className="flex items-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  {topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Flowchart Generation Testing */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-500" />
              Flowchart Generation Testing
            </CardTitle>
            <CardDescription>Test AI-powered flowchart and mind map generation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Quick Test Topics */}
              <div>
                <h4 className="text-sm font-medium mb-2">Quick Test Topics:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    'React Development',
                    'Machine Learning',
                    'Database Design', 
                    'Web Security',
                    'Python Programming',
                    'Data Structures',
                    'Cloud Computing',
                    'DevOps Practices'
                  ].map((topic) => (
                    <Button
                      key={topic}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFlowchartTopic(topic);
                        testFlowchartGeneration(topic, flowchartType, flowchartComplexity);
                        addLog(`🎯 Testing with quick topic: ${topic}`);
                      }}
                      disabled={isGeneratingFlowchart}
                      className="text-xs"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Topic Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter custom topic..."
                  value={flowchartTopic}
                  onChange={(e) => setFlowchartTopic(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded text-sm"
                  disabled={isGeneratingFlowchart}
                />
                <Button
                  onClick={() => {
                    if (flowchartTopic.trim()) {
                      testFlowchartGeneration(flowchartTopic, flowchartType, flowchartComplexity);
                    }
                  }}
                  disabled={isGeneratingFlowchart || !flowchartTopic.trim()}
                  size="sm"
                >
                  {isGeneratingFlowchart ? <Zap className="w-4 h-4 animate-spin" /> : 'Generate'}
                </Button>
              </div>

              {/* Generation Options */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type:</label>
                  <select
                    value={flowchartType}
                    onChange={(e) => setFlowchartType(e.target.value as 'study-plan' | 'mind-map')}
                    className="w-full mt-1 px-3 py-2 border rounded text-sm"
                    disabled={isGeneratingFlowchart}
                  >
                    <option value="study-plan">Study Plan (Sequential)</option>
                    <option value="mind-map">Mind Map (Hierarchical)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Complexity:</label>
                  <select
                    value={flowchartComplexity}
                    onChange={(e) => setFlowchartComplexity(e.target.value as 'beginner' | 'intermediate' | 'advanced')}
                    className="w-full mt-1 px-3 py-2 border rounded text-sm"
                    disabled={isGeneratingFlowchart}
                  >
                    <option value="beginner">🟢 Beginner (5-8 nodes)</option>
                    <option value="intermediate">🟡 Intermediate (8-12 nodes)</option>
                    <option value="advanced">🔴 Advanced (12+ nodes)</option>
                  </select>
                </div>
              </div>

              {/* Status */}
              {isGeneratingFlowchart && (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    Generating {flowchartType} for "{flowchartTopic}"... ({flowchartComplexity} complexity)
                  </AlertDescription>
                </Alert>
              )}

              {flowchartError && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>{flowchartError}</AlertDescription>
                </Alert>
              )}

              {generatedPlan && (
                <div className="space-y-2">
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Successfully generated {flowchartType} with {generatedPlan.nodes.length} nodes and {generatedPlan.edges.length} connections
                    </AlertDescription>
                  </Alert>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setGeneratedPlan(null)}
                  >
                    Clear Result
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Generated Flowchart Display */}
        {generatedPlan && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Generated Flowchart</CardTitle>
              <CardDescription>{generatedPlan.title} - {generatedPlan.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 bg-gray-50">
                <FlowchartViewer
                  nodes={generatedPlan.nodes}
                  edges={generatedPlan.edges}
                  title={generatedPlan.title}
                  description={generatedPlan.description}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Logs */}
        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-60 overflow-y-auto">
                {logs.map((log, index) => (
                  <div key={index}>{log}</div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* YouTube Video Modal */}
        <YouTubeVideoModal
          open={youtubeModalOpen}
          onClose={() => setYoutubeModalOpen(false)}
          topic={selectedTopic}
        />
      </div>
    </Layout>
  );
};

export default Debug;
