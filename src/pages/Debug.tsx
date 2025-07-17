import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Database, Brain, User } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import { testDatabaseConnection } from '@/lib/database';
import { generateQuizQuestions } from '@/lib/ollama';
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
    
    addLog('✅ All tests completed');
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
      </div>
    </Layout>
  );
};

export default Debug;
