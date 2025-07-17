# 🎯 AI-Powered Flowchart Generation System

## Overview
The Think-Forge platform now includes an AI-powered flowchart generation system that creates study plans and mind maps using Ollama. Users can request flowcharts directly in the chat, and the system will generate interactive, visual learning plans.

## Features

### 🧠 Study Plan Generation
- **Interactive Flowcharts**: Visual step-by-step learning paths
- **AI-Generated Content**: Powered by Ollama (mistral:7b model)
- **Customizable Topics**: Works with any subject or learning goal
- **Time Estimates**: Realistic time projections for each step
- **Difficulty Levels**: Beginner, Intermediate, and Advanced plans

### 🎨 Mind Map Creation
- **Visual Concept Mapping**: Central topic with branching concepts
- **Hierarchical Structure**: Main branches with sub-concepts
- **Interactive Navigation**: Pan, zoom, and explore concepts
- **Export Options**: Download as JSON for sharing

### 🤖 Smart Chat Integration
- **Natural Language Processing**: Detects flowchart requests in chat
- **Keyword Recognition**: Responds to terms like "flowchart", "study plan", "mind map"
- **Context Awareness**: Uses selected subject for topic generation
- **Button Integration**: Easy access to generated flowcharts

## How to Use

### 1. Request a Study Plan
In the chat, use phrases like:
- "Create a study plan for Machine Learning"
- "Generate a flowchart for Python programming"
- "I need a learning roadmap for Data Science"

### 2. Request a Mind Map
Use mind map specific keywords:
- "Create a mind map for React.js"
- "Generate a mindmap for Database Design"
- "Show me a mind map of AI concepts"

### 3. Interactive Features
- **Zoom & Pan**: Navigate large flowcharts easily
- **Minimap**: Quick overview and navigation
- **Legend**: Visual guide for node types
- **Export**: Download flowcharts as JSON files
- **Share**: Share flowcharts with others

## Technical Implementation

### Architecture
```
Chat Request → Topic Detection → Ollama AI → JSON Parsing → Flowchart Rendering
```

### Key Components
- **FlowchartService** (`src/lib/flowchart.ts`): Core AI integration
- **FlowchartViewer** (`src/components/flowchart/FlowchartViewer.tsx`): ReactFlow-based renderer
- **StudyPlan Page** (`src/pages/StudyPlan.tsx`): Full-screen flowchart view
- **Chat Integration** (`src/pages/Chat.tsx`): Smart request detection

### AI Integration
- **Model**: Ollama mistral:7b
- **Prompts**: Structured JSON generation for flowcharts
- **Fallbacks**: Default templates if AI generation fails
- **Context**: Uses conversation history and selected subjects

### Data Flow
1. **User Input**: Natural language request in chat
2. **Detection**: Keyword matching for flowchart requests
3. **AI Generation**: Ollama creates structured study plan
4. **Parsing**: JSON extraction and validation
5. **Rendering**: ReactFlow visualization with custom styling
6. **Interaction**: User can explore, export, and share

## Node Types

### Study Plans
- **Start** (Green Circle): Beginning of learning journey
- **Process** (Blue Rectangle): Learning steps and activities
- **Decision** (Yellow Diamond): Choice points in learning path
- **End** (Red Circle): Completion milestones

### Mind Maps
- **Central** (Green Circle): Main topic at center
- **Branch** (Blue Rectangle): Major concept areas
- **Leaf** (Gray Rectangle): Specific sub-concepts

## Customization Options

### Styling
- **Dark/Light Mode**: Automatic theme adaptation
- **Node Colors**: Type-based color coding
- **Animations**: Smooth transitions and interactions
- **Responsive**: Works on desktop and mobile

### Export Formats
- **JSON**: Complete flowchart data structure
- **URL Sharing**: Shareable links with parameters
- **Native Sharing**: Browser share API integration

## Future Enhancements

### Planned Features
- **PDF Export**: Generate printable study guides
- **Collaborative Editing**: Multi-user flowchart creation
- **Template Library**: Pre-built flowchart templates
- **Progress Tracking**: Mark completed steps
- **Integration**: Connect with existing progress system

### AI Improvements
- **Multiple Models**: Support for different AI providers
- **Better Parsing**: More robust JSON extraction
- **Adaptive Prompts**: Context-aware prompt generation
- **Learning Styles**: Customize for different learning preferences

## Usage Examples

### Example Chat Requests
```
User: "Create a flowchart for learning React.js"
AI: "I'll create a study plan for React.js! Click the button below to view your AI-generated study plan."
[Generate study plan button appears]
```

### Example Generated Study Plan
```json
{
  "title": "React.js Learning Path",
  "description": "Comprehensive guide to mastering React",
  "estimatedTime": "6-8 weeks",
  "difficulty": "intermediate",
  "nodes": [
    {
      "id": "start",
      "label": "Begin React Journey\n1 day",
      "type": "start"
    },
    {
      "id": "fundamentals",
      "label": "JavaScript Fundamentals\n1 week",
      "type": "process"
    }
  ]
}
```

## Configuration

### Environment Variables
```env
# Ollama Configuration (already configured)
VITE_OLLAMA_URL=http://localhost:11434
VITE_OLLAMA_MODEL=mistral:7b
VITE_USE_MOCK_AI=false
```

### Dependencies
- `reactflow`: Interactive flowchart rendering
- `@google/generative-ai`: (Removed - using Ollama only)
- `dagre`: Auto-layout algorithms (installed but not used yet)
- `mermaid`: Diagram generation support (for future use)

## Troubleshooting

### Common Issues
1. **Ollama Not Running**: Ensure Ollama service is active
2. **Model Not Found**: Verify mistral:7b model is installed
3. **JSON Parsing Errors**: AI response formatting issues (fallback triggered)
4. **Layout Issues**: Browser compatibility with ReactFlow

### Debug Information
- Console logs track the entire generation process
- Fallback templates ensure functionality even if AI fails
- Error boundaries prevent crashes during generation

## Integration with Existing Features

### Chat System
- Seamless integration with existing chat functionality
- Preserves conversation history and context
- Uses existing authentication and session management

### Database
- Study plans can be saved for future reference
- Integration with user progress tracking
- Chat history includes flowchart generation requests

### UI Components
- Consistent with existing shadcn/ui design system
- Responsive design matches application theme
- Accessibility features maintained

This flowchart generation system significantly enhances the learning experience by providing visual, structured study paths powered by AI, making complex topics more approachable and organized for learners.
