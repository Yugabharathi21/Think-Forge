import { generateChatResponse } from './ollama';

export interface FlowchartNode {
  id: string;
  label: string;
  description?: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'milestone';
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

export interface GenerationOptions {
  complexity?: 'beginner' | 'intermediate' | 'advanced';
  fastMode?: boolean;
}

interface StudyStep {
  id: string;
  title: string;
  description: string;
  type: 'start' | 'process' | 'decision' | 'end' | 'milestone';
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
  private getComplexitySettings(complexity: 'beginner' | 'intermediate' | 'advanced') {
    switch (complexity) {
      case 'beginner':
        return { minSteps: 5, maxSteps: 8, description: 'simplified learning path' };
      case 'intermediate':
        return { minSteps: 8, maxSteps: 12, description: 'comprehensive study plan' };
      case 'advanced':
        return { minSteps: 12, maxSteps: 16, description: 'detailed expert-level curriculum' };
      default:
        return { minSteps: 8, maxSteps: 12, description: 'comprehensive study plan' };
    }
  }

  private async generateFlowchartPrompt(
    topic: string, 
    learningGoals?: string[], 
    options: GenerationOptions = {}
  ): Promise<string> {
    const goalsText = learningGoals ? `\nSpecific learning goals: ${learningGoals.join(', ')}` : '';
    const { complexity = 'intermediate', fastMode = false } = options;
    const settings = this.getComplexitySettings(complexity);
    
    const basePrompt = `Create a ${settings.description} for the topic: "${topic}"${goalsText}

Please provide a JSON response with the following structure:
{
  "title": "Study Plan Title",
  "description": "Brief description of the study plan",
  "estimatedTime": "Total estimated time (e.g., '2 weeks', '1 month')",
  "difficulty": "${complexity}",
  "steps": [
    {
      "id": "step1",
      "title": "Step Title",
      "description": "Detailed description of what to learn",
      "type": "start|process|decision|end|milestone",
      "estimatedTime": "Time for this step",
      "prerequisites": ["previous_step_id"],
      "resources": ["resource1", "resource2"]
    }
  ]
}`;

    if (fastMode) {
      return basePrompt + `

Fast Mode Requirements:
- Include ${settings.minSteps}-${Math.min(settings.maxSteps, settings.minSteps + 3)} learning steps
- Focus on essential concepts only
- Provide concise descriptions
- Use straightforward progression

Topic: ${topic}`;
    } else {
      return basePrompt + `

Comprehensive Mode Requirements:
- Include ${settings.minSteps}-${settings.maxSteps} logical learning steps
- Start with fundamentals and progress to advanced concepts
- Include decision points for different learning paths
- Add milestone markers for major achievements
- Provide realistic time estimates and detailed descriptions
- Suggest relevant learning resources (books, tutorials, documentation)
- Focus on conceptual understanding and practical application
- Make it comprehensive but achievable
- Do NOT include practice tests, assessments, quizzes, or examinations

Node Types to Use:
- "start": Beginning of the learning journey
- "process": Regular learning steps or activities (concepts, tutorials, hands-on work)
- "decision": Points where learners choose between paths
- "milestone": Major achievements or checkpoints
- "end": Completion of the study plan

Topic: ${topic}`;
    }
  }

  async generateStudyPlan(
    topic: string, 
    options: GenerationOptions = {}, 
    learningGoals?: string[]
  ): Promise<StudyPlan> {
    try {
      console.log('🎯 Generating study plan for:', topic, 'with options:', options);
      
      const prompt = await this.generateFlowchartPrompt(topic, learningGoals, options);
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
      const studyPlan = this.convertToFlowchart(studyPlanData, options);
      
      console.log('✅ Study plan generated successfully');
      return studyPlan;
      
    } catch (error) {
      console.error('❌ Error generating study plan:', error);
      // Return a fallback study plan
      return this.getFallbackStudyPlan(topic, options);
    }
  }

  private convertToFlowchart(data: StudyPlanData, options: GenerationOptions = {}): StudyPlan {
    const nodes: FlowchartNode[] = [];
    const edges: FlowchartEdge[] = [];
    const { complexity = 'intermediate' } = options;
    
    // Generate positions for nodes in an intelligent layout
    data.steps.forEach((step: StudyStep, index: number) => {
      // Create more sophisticated positioning based on complexity
      const isAdvanced = complexity === 'advanced';
      const cols = isAdvanced ? 3 : 2;
      const col = index % cols;
      const row = Math.floor(index / cols);
      
      const baseX = 150 + col * 300;
      const baseY = 100 + row * 180;
      
      // Add some randomization for better visual appeal
      const offsetX = (Math.random() - 0.5) * 50;
      const offsetY = (Math.random() - 0.5) * 30;
      
      const node: FlowchartNode = {
        id: step.id,
        label: step.title,
        description: step.description,
        type: step.type || (index === 0 ? 'start' : 
              index === data.steps.length - 1 ? 'end' : 'process'),
        position: {
          x: baseX + offsetX,
          y: baseY + offsetY
        }
      };
      nodes.push(node);
      
      // Create edges between consecutive steps and prerequisites
      if (index > 0) {
        const edge: FlowchartEdge = {
          id: `edge-${data.steps[index-1].id}-${step.id}`,
          source: data.steps[index-1].id,
          target: step.id,
          label: step.estimatedTime
        };
        edges.push(edge);
      }
      
      // Create edges for prerequisites
      step.prerequisites?.forEach(prereqId => {
        if (prereqId !== data.steps[index-1]?.id) {
          const prereqEdge: FlowchartEdge = {
            id: `edge-prereq-${prereqId}-${step.id}`,
            source: prereqId,
            target: step.id,
            label: 'prereq'
          };
          edges.push(prereqEdge);
        }
      });
    });

    return {
      title: data.title || `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} Study Plan`,
      description: data.description || 'AI-generated study plan',
      nodes,
      edges,
      estimatedTime: data.estimatedTime || 'Variable',
      difficulty: data.difficulty || complexity || 'intermediate'
    };
  }

  private getFallbackStudyPlan(topic: string, options: GenerationOptions = {}): StudyPlan {
    const { complexity = 'intermediate' } = options;
    const settings = this.getComplexitySettings(complexity);
    
    const basicNodes: FlowchartNode[] = [
      {
        id: 'start',
        label: `Begin ${topic}`,
        description: 'Start your learning journey',
        type: 'start',
        position: { x: 250, y: 50 }
      },
      {
        id: 'basics',
        label: `${topic} Fundamentals`,
        description: 'Learn the core concepts and basics',
        type: 'process',
        position: { x: 250, y: 200 }
      },
      {
        id: 'concepts',
        label: 'Core Concepts',
        description: 'Understand key principles and ideas',
        type: 'process',
        position: { x: 250, y: 350 }
      }
    ];

    if (complexity !== 'beginner') {
      basicNodes.push(
        {
          id: 'intermediate',
          label: 'Intermediate Concepts',
          description: 'Dive deeper into advanced topics',
          type: 'process',
          position: { x: 250, y: 500 }
        },
        {
          id: 'milestone',
          label: 'Learning Milestone',
          description: 'Check your understanding and progress',
          type: 'milestone',
          position: { x: 450, y: 425 }
        }
      );
    }

    if (complexity === 'advanced') {
      basicNodes.push(
        {
          id: 'advanced',
          label: 'Advanced Topics',
          description: 'Master expert-level concepts',
          type: 'process',
          position: { x: 250, y: 650 }
        },
        {
          id: 'specialization',
          label: 'Choose Specialization',
          description: 'Select your area of focus',
          type: 'decision',
          position: { x: 450, y: 650 }
        }
      );
    }

    basicNodes.push({
      id: 'end',
      label: 'Complete Study Plan',
      description: 'Congratulations on completing your learning journey!',
      type: 'end',
      position: { x: 250, y: complexity === 'advanced' ? 800 : (complexity === 'intermediate' ? 650 : 500) }
    });

    const edges: FlowchartEdge[] = [];
    for (let i = 0; i < basicNodes.length - 1; i++) {
      if (basicNodes[i].type !== 'milestone') {
        edges.push({
          id: `edge${i + 1}`,
          source: basicNodes[i].id,
          target: basicNodes[i + 1].id
        });
      }
    }

    // Add milestone connections
    if (complexity !== 'beginner') {
      edges.push({
        id: 'edge-milestone',
        source: 'concepts',
        target: 'milestone'
      });
    }

    return {
      title: `${complexity.charAt(0).toUpperCase() + complexity.slice(1)} Study Plan: ${topic}`,
      description: `A ${complexity}-level study plan structure`,
      nodes: basicNodes,
      edges,
      estimatedTime: complexity === 'beginner' ? '2-3 weeks' : complexity === 'intermediate' ? '1-2 months' : '2-3 months',
      difficulty: complexity
    };
  }

  async generateMindMap(topic: string, options: GenerationOptions = {}): Promise<StudyPlan> {
    try {
      console.log('🧠 Generating mind map for:', topic, 'with options:', options);
      
      const { complexity = 'intermediate', fastMode = false } = options;
      const settings = this.getComplexitySettings(complexity);
      
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

${fastMode ? `
Fast Mode: Create a simplified mind map with:
- 4-6 main branches (key concepts)
- 1-2 sub-branches for each main branch
- Focus on essential concepts only
` : `
Comprehensive Mode: Create a detailed mind map with:
- ${Math.max(4, Math.min(8, settings.maxSteps / 2))} main branches (key concepts)
- 2-4 sub-branches for each main branch
- Clear relationships between concepts
- Include both theoretical and practical aspects
`}`;

      const aiResponse = await generateChatResponse(null, prompt, 'Mind Mapping', []);
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }
      
      const mindMapData = JSON.parse(jsonMatch[0]) as MindMapData;
      return this.convertMindMapToFlowchart(mindMapData, topic, options);
      
    } catch (error) {
      console.error('❌ Error generating mind map:', error);
      return this.getFallbackMindMap(topic, options);
    }
  }

  private convertMindMapToFlowchart(data: MindMapData, topic: string, options: GenerationOptions = {}): StudyPlan {
    const nodes: FlowchartNode[] = [];
    const edges: FlowchartEdge[] = [];
    const { complexity = 'intermediate' } = options;
    
    // Central node
    nodes.push({
      id: 'central',
      label: topic,
      description: 'Central concept of the mind map',
      type: 'start',
      position: { x: 400, y: 300 }
    });

    const branches = data.concepts[0]?.branches || [];
    const angleStep = (2 * Math.PI) / branches.length;
    
    branches.forEach((branch: MindMapBranch, index: number) => {
      const angle = index * angleStep;
      const radius = 200;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);
      
      nodes.push({
        id: branch.id,
        label: branch.title,
        description: `Key concept: ${branch.title}`,
        type: 'process',
        position: { x, y }
      });
      
      edges.push({
        id: `edge-central-${branch.id}`,
        source: 'central',
        target: branch.id
      });
      
      // Add sub-branches with better positioning
      branch.subbranches?.forEach((sub, subIndex: number) => {
        const subAngle = angle + (subIndex - (branch.subbranches!.length - 1) / 2) * 0.4;
        const subRadius = 120;
        const subX = x + subRadius * Math.cos(subAngle);
        const subY = y + subRadius * Math.sin(subAngle);
        
        nodes.push({
          id: sub.id,
          label: sub.title,
          description: `Sub-concept of ${branch.title}`,
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
      description: `Visual concept mapping for ${topic} (${complexity} level)`,
      nodes,
      edges,
      estimatedTime: 'Reference',
      difficulty: complexity
    };
  }

  private getFallbackMindMap(topic: string, options: GenerationOptions = {}): StudyPlan {
    const { complexity = 'intermediate' } = options;
    
    const baseNodes: FlowchartNode[] = [
      {
        id: 'central',
        label: topic,
        description: `Central concept: ${topic}`,
        type: 'start',
        position: { x: 400, y: 300 }
      }
    ];

    const concepts = complexity === 'beginner' ? 4 : complexity === 'intermediate' ? 6 : 8;
    const angleStep = (2 * Math.PI) / concepts;
    
    for (let i = 0; i < concepts; i++) {
      const angle = i * angleStep;
      const radius = 200;
      const x = 400 + radius * Math.cos(angle);
      const y = 300 + radius * Math.sin(angle);
      
      baseNodes.push({
        id: `concept${i + 1}`,
        label: `Key Concept ${i + 1}`,
        description: `Important aspect of ${topic}`,
        type: 'process',
        position: { x, y }
      });
    }

    const edges: FlowchartEdge[] = [];
    for (let i = 1; i <= concepts; i++) {
      edges.push({
        id: `edge${i}`,
        source: 'central',
        target: `concept${i}`
      });
    }

    return {
      title: `Mind Map: ${topic}`,
      description: `${complexity.charAt(0).toUpperCase() + complexity.slice(1)}-level mind map structure`,
      nodes: baseNodes,
      edges,
      estimatedTime: 'Reference',
      difficulty: complexity
    };
  }
}

export const flowchartService = new FlowchartService();
