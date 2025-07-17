import { generateChatResponse } from './ollama';

export interface FlowchartNode {
  id: string;
  label: string;
  type: 'start' | 'process' | 'decision' | 'end';
  position: { x: number; y: number };
}

export interface FlowchartEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
}

export interface StudyPlan {
  title: string;
  description: string;
  nodes: FlowchartNode[];
  edges: FlowchartEdge[];
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface StudyStep {
  id: string;
  title: string;
  description: string;
  type: 'start' | 'process' | 'decision' | 'end';
  estimatedTime: string;
  prerequisites: string[];
  resources: string[];
}

interface StudyPlanData {
  title: string;
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  steps: StudyStep[];
}

interface MindMapBranch {
  id: string;
  title: string;
  type: string;
  subbranches?: Array<{
    id: string;
    title: string;
    type: string;
  }>;
}

interface MindMapData {
  title: string;
  description: string;
  concepts: Array<{
    id: string;
    title: string;
    type: string;
    branches: MindMapBranch[];
  }>;
}

class FlowchartService {
  private async generateFlowchartPrompt(topic: string, learningGoals?: string[]): Promise<string> {
    const goalsText = learningGoals ? `\nSpecific learning goals: ${learningGoals.join(', ')}` : '';
    
    return `Create a detailed study plan flowchart for the topic: "${topic}"${goalsText}

Please provide a JSON response with the following structure:
{
  "title": "Study Plan Title",
  "description": "Brief description of the study plan",
  "estimatedTime": "Total estimated time (e.g., '2 weeks', '1 month')",
  "difficulty": "beginner|intermediate|advanced",
  "steps": [
    {
      "id": "step1",
      "title": "Step Title",
      "description": "Detailed description",
      "type": "start|process|decision|end",
      "estimatedTime": "Time for this step",
      "prerequisites": ["previous_step_id"],
      "resources": ["resource1", "resource2"]
    }
  ]
}

Make sure to:
1. Include 6-10 logical learning steps
2. Start with fundamentals and progress to advanced concepts
3. Include decision points for different learning paths
4. Provide realistic time estimates
5. Suggest relevant learning resources
6. Make it comprehensive but achievable

Topic: ${topic}`;
  }

  async generateStudyPlan(topic: string, learningGoals?: string[]): Promise<StudyPlan> {
    try {
      console.log('🎯 Generating study plan for:', topic);
      
      const prompt = await this.generateFlowchartPrompt(topic, learningGoals);
      const aiResponse = await generateChatResponse(null, prompt, 'Study Planning', []);
      
      console.log('🤖 AI Response received for flowchart');
      
      // Extract JSON from AI response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      const studyPlanData = JSON.parse(jsonMatch[0]) as StudyPlanData;
      console.log('📊 Parsed study plan data:', studyPlanData);
      
      // Convert AI response to flowchart format
      const studyPlan = this.convertToFlowchart(studyPlanData);
      
      console.log('✅ Study plan generated successfully');
      return studyPlan;
      
    } catch (error) {
      console.error('❌ Error generating study plan:', error);
      // Return a fallback study plan
      return this.getFallbackStudyPlan(topic);
    }
  }

  private convertToFlowchart(data: StudyPlanData): StudyPlan {
    const nodes: FlowchartNode[] = [];
    const edges: FlowchartEdge[] = [];
    
    // Generate positions for nodes in a vertical flow
    data.steps.forEach((step: StudyStep, index: number) => {
      const node: FlowchartNode = {
        id: step.id,
        label: `${step.title}\n${step.estimatedTime}`,
        type: step.type || (index === 0 ? 'start' : 
              index === data.steps.length - 1 ? 'end' : 'process'),
        position: {
          x: 250 + (index % 2) * 300, // Alternate left/right for better layout
          y: 100 + index * 150
        }
      };
      nodes.push(node);
      
      // Create edges between consecutive steps
      if (index > 0) {
        const edge: FlowchartEdge = {
          id: `edge-${data.steps[index-1].id}-${step.id}`,
          source: data.steps[index-1].id,
          target: step.id
        };
        edges.push(edge);
      }
    });

    return {
      title: data.title || 'Study Plan',
      description: data.description || 'AI-generated study plan',
      nodes,
      edges,
      estimatedTime: data.estimatedTime || 'Variable',
      difficulty: data.difficulty || 'intermediate'
    };
  }

  private getFallbackStudyPlan(topic: string): StudyPlan {
    const nodes: FlowchartNode[] = [
      {
        id: 'start',
        label: `Begin ${topic}\nStudy Plan`,
        type: 'start',
        position: { x: 250, y: 50 }
      },
      {
        id: 'basics',
        label: `Learn ${topic}\nFundamentals`,
        type: 'process',
        position: { x: 250, y: 200 }
      },
      {
        id: 'practice',
        label: 'Practice &\nExercises',
        type: 'process',
        position: { x: 250, y: 350 }
      },
      {
        id: 'advanced',
        label: 'Advanced\nConcepts',
        type: 'process',
        position: { x: 250, y: 500 }
      },
      {
        id: 'end',
        label: 'Complete\nStudy Plan',
        type: 'end',
        position: { x: 250, y: 650 }
      }
    ];

    const edges: FlowchartEdge[] = [
      { id: 'edge1', source: 'start', target: 'basics' },
      { id: 'edge2', source: 'basics', target: 'practice' },
      { id: 'edge3', source: 'practice', target: 'advanced' },
      { id: 'edge4', source: 'advanced', target: 'end' }
    ];

    return {
      title: `Study Plan: ${topic}`,
      description: 'Basic study plan structure',
      nodes,
      edges,
      estimatedTime: '2-4 weeks',
      difficulty: 'intermediate'
    };
  }

  async generateMindMap(topic: string): Promise<StudyPlan> {
    try {
      console.log('🧠 Generating mind map for:', topic);
      
      const prompt = `Create a mind map structure for the topic: "${topic}"

Please provide a JSON response with a mind map structure:
{
  "title": "Mind Map: ${topic}",
  "description": "Visual representation of ${topic} concepts",
  "concepts": [
    {
      "id": "central",
      "title": "Central Topic",
      "type": "central",
      "branches": [
        {
          "id": "branch1",
          "title": "Main Branch 1",
          "type": "branch",
          "subbranches": [
            {"id": "sub1", "title": "Sub-concept 1", "type": "leaf"},
            {"id": "sub2", "title": "Sub-concept 2", "type": "leaf"}
          ]
        }
      ]
    }
  ]
}

Create a comprehensive mind map with:
1. Central topic in the middle
2. 4-6 main branches (key concepts)
3. 2-4 sub-branches for each main branch
4. Clear relationships between concepts`;

      const aiResponse = await generateChatResponse(null, prompt, 'Mind Mapping', []);
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      const mindMapData = JSON.parse(jsonMatch[0]) as MindMapData;
      return this.convertMindMapToFlowchart(mindMapData, topic);
      
    } catch (error) {
      console.error('❌ Error generating mind map:', error);
      return this.getFallbackMindMap(topic);
    }
  }

  private convertMindMapToFlowchart(data: MindMapData, topic: string): StudyPlan {
    const nodes: FlowchartNode[] = [];
    const edges: FlowchartEdge[] = [];
    
    // Central node
    nodes.push({
      id: 'central',
      label: topic,
      type: 'start',
      position: { x: 400, y: 300 }
    });

    const angleStep = (2 * Math.PI) / (data.concepts[0]?.branches?.length || 6);
    
    data.concepts[0]?.branches?.forEach((branch: MindMapBranch, index: number) => {
      const angle = index * angleStep;
      const radius = 200;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);
      
      nodes.push({
        id: branch.id,
        label: branch.title,
        type: 'process',
        position: { x, y }
      });
      
      edges.push({
        id: `edge-central-${branch.id}`,
        source: 'central',
        target: branch.id
      });
      
      // Add sub-branches
      branch.subbranches?.forEach((sub, subIndex: number) => {
        const subAngle = angle + (subIndex - 1) * 0.3;
        const subRadius = 120;
        const subX = x + subRadius * Math.cos(subAngle);
        const subY = y + subRadius * Math.sin(subAngle);
        
        nodes.push({
          id: sub.id,
          label: sub.title,
          type: 'process',
          position: { x: subX, y: subY }
        });
        
        edges.push({
          id: `edge-${branch.id}-${sub.id}`,
          source: branch.id,
          target: sub.id
        });
      });
    });

    return {
      title: `Mind Map: ${topic}`,
      description: 'Visual concept mapping',
      nodes,
      edges,
      estimatedTime: 'Reference',
      difficulty: 'intermediate'
    };
  }

  private getFallbackMindMap(topic: string): StudyPlan {
    const nodes: FlowchartNode[] = [
      {
        id: 'central',
        label: topic,
        type: 'start',
        position: { x: 400, y: 300 }
      },
      {
        id: 'concept1',
        label: 'Key Concept 1',
        type: 'process',
        position: { x: 200, y: 150 }
      },
      {
        id: 'concept2',
        label: 'Key Concept 2',
        type: 'process',
        position: { x: 600, y: 150 }
      },
      {
        id: 'concept3',
        label: 'Key Concept 3',
        type: 'process',
        position: { x: 200, y: 450 }
      },
      {
        id: 'concept4',
        label: 'Key Concept 4',
        type: 'process',
        position: { x: 600, y: 450 }
      }
    ];

    const edges: FlowchartEdge[] = [
      { id: 'edge1', source: 'central', target: 'concept1' },
      { id: 'edge2', source: 'central', target: 'concept2' },
      { id: 'edge3', source: 'central', target: 'concept3' },
      { id: 'edge4', source: 'central', target: 'concept4' }
    ];

    return {
      title: `Mind Map: ${topic}`,
      description: 'Basic mind map structure',
      nodes,
      edges,
      estimatedTime: 'Reference',
      difficulty: 'intermediate'
    };
  }
}

export const flowchartService = new FlowchartService();
