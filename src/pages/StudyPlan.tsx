import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Brain, BookOpen, Clock, Lightbulb, Download, Share2 } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import FlowchartViewer from '@/components/flowchart/FlowchartViewer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { flowchartService, StudyPlan } from '@/lib/flowchart';
import { useAuth } from '@/contexts/AuthContext';

const StudyPlanPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const [studyPlan, setStudyPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topic = searchParams.get('topic') || '';
  const type = searchParams.get('type') || 'study-plan'; // 'study-plan' or 'mind-map'

  const generateStudyPlan = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log(`🎯 Generating ${type} for topic:`, topic);
      
      let plan: StudyPlan;
      if (type === 'mind-map') {
        plan = await flowchartService.generateMindMap(topic);
      } else {
        plan = await flowchartService.generateStudyPlan(topic);
      }
      
      setStudyPlan(plan);
      console.log('✅ Study plan generated successfully');
      
    } catch (err) {
      console.error('❌ Error generating study plan:', err);
      setError('Failed to generate study plan. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (topic) {
      generateStudyPlan();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic, type]);

  const handleDownload = () => {
    if (!studyPlan) return;
    
    const dataStr = JSON.stringify(studyPlan, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${studyPlan.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleShare = async () => {
    if (!studyPlan) return;
    
    const shareData = {
      title: studyPlan.title,
      text: studyPlan.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        alert('Study plan link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  if (!topic) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-6 w-6" />
                Study Plan Generator
              </CardTitle>
              <CardDescription>
                No topic specified. Please go back to the chat and ask for a study plan or flowchart.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {type === 'mind-map' ? (
                <Lightbulb className="h-8 w-8 text-yellow-500" />
              ) : (
                <BookOpen className="h-8 w-8 text-blue-500" />
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {type === 'mind-map' ? 'Mind Map' : 'Study Plan'}: {topic}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  AI-generated {type === 'mind-map' ? 'mind map' : 'study plan'} using Ollama
                </p>
              </div>
            </div>
            
            {studyPlan && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleShare}
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            )}
          </div>

          {/* Study Plan Info */}
          {studyPlan && (
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {studyPlan.estimatedTime}
              </Badge>
              <Badge 
                variant={
                  studyPlan.difficulty === 'beginner' ? 'default' :
                  studyPlan.difficulty === 'intermediate' ? 'secondary' : 'destructive'
                }
              >
                {studyPlan.difficulty.charAt(0).toUpperCase() + studyPlan.difficulty.slice(1)}
              </Badge>
              <Badge variant="outline">
                {studyPlan.nodes.length} Steps
              </Badge>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                <p className="text-gray-600 dark:text-gray-400">
                  Generating your {type === 'mind-map' ? 'mind map' : 'study plan'}...
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  This may take a few moments while our AI analyzes the topic.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Oops! Something went wrong
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {error}
                  </p>
                  <Button onClick={generateStudyPlan}>
                    Try Again
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Study Plan Content */}
        {studyPlan && !isLoading && (
          <div className="space-y-6">
            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Overview</CardTitle>
                <CardDescription>
                  {studyPlan.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Flowchart */}
            <FlowchartViewer
              nodes={studyPlan.nodes}
              edges={studyPlan.edges}
              title={studyPlan.title}
              description={studyPlan.description}
              className="w-full"
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudyPlanPage;
