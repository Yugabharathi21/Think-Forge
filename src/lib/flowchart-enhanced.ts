import { flowchartService, StudyPlan, FlowchartNode as BaseNode } from './flowchart';

// Minimal types (FlowchartStudio currently imports from features/chat/types but those aren't defined yet)
export type FlowchartType = 'study-plan' | 'mind-map';
export type TopicComplexity = 'beginner' | 'intermediate' | 'advanced';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type TimeConstraint = 'intensive' | 'moderate' | 'relaxed';

export interface EnhancedGenerationOptions {
  learningStyle: LearningStyle;
  timeConstraint: TimeConstraint;
  focusAreas: string[];
  includeAssessments: boolean;
  includeResources: boolean;
  adaptiveLearning: boolean;
  fastMode: boolean;
}

export interface EnhancedFlowchartNode extends BaseNode {
  progress?: number; // user progress (0-100)
  resources?: string[];
  assessment?: {
    type: 'quiz' | 'reflection';
    prompt: string;
  };
  recommendations?: string[]; // adaptive suggestions
}

export interface EnhancedFlowchartResponse extends StudyPlan {
  nodes: EnhancedFlowchartNode[]; // override
  metadata: {
    learningStyle: LearningStyle;
    timeConstraint: TimeConstraint;
    focusAreas: string[];
    hasAssessments: boolean;
    hasResources: boolean;
    adaptiveLearning: boolean;
    generatedAt: string;
    mode: 'fast' | 'comprehensive';
  };
}

export async function generateEnhancedFlowchart(
  topic: string,
  type: FlowchartType,
  complexity: TopicComplexity,
  options: EnhancedGenerationOptions
): Promise<EnhancedFlowchartResponse> {
  const base: StudyPlan = type === 'mind-map'
    ? await flowchartService.generateMindMap(topic, { complexity, fastMode: options.fastMode })
    : await flowchartService.generateStudyPlan(topic, { complexity, fastMode: options.fastMode });

  const enhancedNodes: EnhancedFlowchartNode[] = base.nodes.map((n, index) => {
    const resources = options.includeResources ? buildResourceStubs(topic, n.label) : undefined;
    const assessment = options.includeAssessments && (index === base.nodes.length - 1 || (index !== 0 && index % 3 === 0))
      ? { type: 'quiz' as const, prompt: `Quick self-check for: ${n.label}` }
      : undefined;
    const recommendations = options.adaptiveLearning ? buildAdaptiveRecommendations(n.label, options.learningStyle) : undefined;
    return { ...n, resources, assessment, recommendations };
  });

  return {
    ...base,
    nodes: enhancedNodes,
    metadata: {
      learningStyle: options.learningStyle,
      timeConstraint: options.timeConstraint,
      focusAreas: options.focusAreas,
      hasAssessments: options.includeAssessments,
      hasResources: options.includeResources,
      adaptiveLearning: options.adaptiveLearning,
      generatedAt: new Date().toISOString(),
      mode: options.fastMode ? 'fast' : 'comprehensive'
    }
  };
}

function buildResourceStubs(topic: string, nodeLabel: string): string[] {
  const base = `${topic} ${nodeLabel}`.replace(/\s+/g, ' ').trim();
  return [
    `Official docs for ${nodeLabel}`,
    `YouTube: ${base} tutorial`,
    `Article: Introduction to ${nodeLabel}`
  ];
}

function buildAdaptiveRecommendations(nodeLabel: string, style: LearningStyle): string[] {
  const styleHints: Record<LearningStyle, string> = {
    visual: 'Create a diagram summarizing key points',
    auditory: 'Explain this concept aloud or record a summary',
    kinesthetic: 'Apply the concept in a small project or exercise',
    reading: 'Write detailed notes summarizing definitions and steps'
  };
  return [
    styleHints[style],
    `Relate ${nodeLabel} to a real world scenario you know`,
    `Identify any prerequisite gaps before moving past ${nodeLabel}`
  ];
}

export async function generateFlowchart(
  topic: string,
  type: FlowchartType,
  complexity: TopicComplexity,
  fastMode: boolean
): Promise<StudyPlan> {
  return type === 'mind-map'
    ? flowchartService.generateMindMap(topic, { complexity, fastMode })
    : flowchartService.generateStudyPlan(topic, { complexity, fastMode });
}
