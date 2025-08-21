import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Camera, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertTriangle, 
  Monitor, 
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Lock,
  Unlock
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { ViolationType, AntiCheatReport } from './types';

interface AntiCheatSystemProps {
  onViolation: (violation: ViolationType, severity: 'low' | 'medium' | 'high') => void;
  onSystemReady: (ready: boolean) => void;
  isQuizActive: boolean;
  strictMode?: boolean;
}

const AntiCheatSystem: React.FC<AntiCheatSystemProps> = ({
  onViolation,
  onSystemReady,
  isQuizActive,
  strictMode = true
}) => {
  const { toast } = useToast();
  
  // Camera and monitoring states
  const [cameraPermission, setCameraPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [cameraActive, setCameraActive] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioPermission, setAudioPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
  const [isWindowFocused, setIsWindowFocused] = useState(true);
  
  // Violation tracking
  const [violations, setViolations] = useState<ViolationType[]>([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [sessionStartTime] = useState(new Date());
  
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const faceDetectionRef = useRef<number>();
  const audioContextRef = useRef<AudioContext>();
  const analyserRef = useRef<AnalyserNode>();
  
  // Add violation
  const addViolation = useCallback((violation: ViolationType) => {
    setViolations(prev => [...prev, violation]);
    onViolation(violation, violation.severity);
    
    toast({
      title: `Security Violation: ${violation.type.replace('_', ' ').toUpperCase()}`,
      description: violation.description,
      variant: violation.severity === 'high' ? "destructive" : "default",
    });
  }, [onViolation, toast]);
  
  // Face detection using basic webcam analysis
  const detectFace = useCallback(async () => {
    if (!videoRef.current || !cameraActive) return;
    
    try {
      // Simple face detection using canvas analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      ctx.drawImage(videoRef.current, 0, 0);
      
      // Basic pixel analysis for face detection (simplified)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Look for skin-tone colors and movement patterns
      let skinPixels = 0;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Basic skin tone detection
        if (r > 95 && g > 40 && b > 20 && 
            Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
            Math.abs(r - g) > 15 && r > g && r > b) {
          skinPixels++;
        }
      }
      
      const facePresent = skinPixels > (canvas.width * canvas.height * 0.01);
      
      if (facePresent !== faceDetected) {
        setFaceDetected(facePresent);
        
        if (!facePresent && isQuizActive) {
          const violation: ViolationType = {
            type: 'face_not_detected',
            timestamp: new Date(),
            description: 'Face not detected in camera feed',
            severity: 'high'
          };
          addViolation(violation);
        }
      }
    } catch (error) {
      console.error('Face detection error:', error);
    }
  }, [cameraActive, faceDetected, isQuizActive, addViolation]);
  
  // Audio monitoring for suspicious sounds
  const monitorAudio = useCallback(() => {
    if (!analyserRef.current) return;
    
    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Analyze for suspicious audio patterns
    const average = dataArray.reduce((a, b) => a + b) / bufferLength;
    
    // Detect sudden audio spikes that might indicate someone else talking
    if (average > 100 && isQuizActive) {
      const violation: ViolationType = {
        type: 'audio_suspicious',
        timestamp: new Date(),
        description: 'Suspicious audio activity detected',
        severity: 'medium'
      };
      addViolation(violation);
    }
  }, [isQuizActive, addViolation]);
  
  // Initialize camera
  const initializeCamera = async () => {
    try {
      console.log('🎥 Requesting camera access...');
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API not supported in this browser');
      }
      
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Clear video element
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true,
        audio: false
      });
      
      console.log('✅ Camera stream obtained:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Simple play after setting source
        setTimeout(async () => {
          if (videoRef.current) {
            try {
              await videoRef.current.play();
              console.log('✅ Video playing successfully');
            } catch (e) {
              console.error('❌ Video play error:', e);
            }
          }
        }, 100);
      }
      
      setCameraPermission('granted');
      setCameraActive(true);
      
      toast({
        title: "Camera Initialized",
        description: "Proctoring system is now active",
      });
      
    } catch (error) {
      console.error('❌ Camera initialization error:', error);
      setCameraPermission('denied');
      
      let errorMessage = "Camera access failed";
      if (error instanceof Error) {
        if (error.message.includes('not supported')) {
          errorMessage = "Camera not supported in this browser";
        } else if (error.name === 'NotAllowedError') {
          errorMessage = "Camera permission denied. Please allow camera access";
        } else if (error.name === 'NotFoundError') {
          errorMessage = "No camera found on this device";
        } else if (error.name === 'NotReadableError') {
          errorMessage = "Camera is being used by another application";
        }
      }
      
      toast({
        title: "Camera Access Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };
  
  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setFaceDetected(false);
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
  };
  
  // Fullscreen enforcement
  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (error) {
      console.error('Fullscreen error:', error);
      toast({
        title: "Fullscreen Required",
        description: "Please enable fullscreen mode for the quiz",
        variant: "destructive",
      });
    }
  };
  
  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
    setIsFullscreen(false);
  };
  
  // Event listeners for various violations
  useEffect(() => {
    // Fullscreen change detection
    const handleFullscreenChange = () => {
      const isFS = !!document.fullscreenElement;
      setIsFullscreen(isFS);
      
      if (!isFS && isQuizActive && strictMode) {
        const violation: ViolationType = {
          type: 'fullscreen_exit',
          timestamp: new Date(),
          description: 'User exited fullscreen mode',
          severity: 'high'
        };
        addViolation(violation);
      }
    };
    
    // Window focus/blur detection
    const handleWindowFocus = () => setIsWindowFocused(true);
    const handleWindowBlur = () => {
      setIsWindowFocused(false);
      if (isQuizActive) {
        const violation: ViolationType = {
          type: 'window_blur',
          timestamp: new Date(),
          description: 'Window lost focus (possible tab switching)',
          severity: 'medium'
        };
        addViolation(violation);
      }
    };
    
    // Visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (document.hidden && isQuizActive) {
        setTabSwitchCount(prev => prev + 1);
        const violation: ViolationType = {
          type: 'tab_switch',
          timestamp: new Date(),
          description: 'User switched tabs or minimized window',
          severity: 'high'
        };
        addViolation(violation);
      }
    };
    
    // Keyboard shortcuts detection
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isQuizActive) return;
      
      // Detect common cheating key combinations
      const suspiciousKeys = [
        { keys: ['Control', 'c'], desc: 'Copy attempt' },
        { keys: ['Control', 'v'], desc: 'Paste attempt' },
        { keys: ['Control', 'a'], desc: 'Select all attempt' },
        { keys: ['Control', 't'], desc: 'New tab attempt' },
        { keys: ['Control', 'w'], desc: 'Close tab attempt' },
        { keys: ['Alt', 'Tab'], desc: 'Alt+Tab switching' },
        { keys: ['F12'], desc: 'Developer tools attempt' },
        { keys: ['Control', 'Shift', 'i'], desc: 'Developer tools attempt' },
        { keys: ['Control', 'u'], desc: 'View source attempt' }
      ];
      
      for (const combo of suspiciousKeys) {
        if (combo.keys.every(key => event.getModifierState(key) || event.key === key)) {
          event.preventDefault();
          const violation: ViolationType = {
            type: 'key_combination',
            timestamp: new Date(),
            description: combo.desc,
            severity: 'medium'
          };
          addViolation(violation);
          break;
        }
      }
    };
    
    // Right-click prevention
    const handleContextMenu = (event: MouseEvent) => {
      if (isQuizActive && strictMode) {
        event.preventDefault();
        const violation: ViolationType = {
          type: 'right_click',
          timestamp: new Date(),
          description: 'Right-click attempted',
          severity: 'low'
        };
        addViolation(violation);
      }
    };
    
    // Add event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('focus', handleWindowFocus);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('focus', handleWindowFocus);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [isQuizActive, strictMode, addViolation]);
  
  // Face detection loop
  useEffect(() => {
    if (cameraActive && isQuizActive) {
      faceDetectionRef.current = window.setInterval(() => {
        detectFace();
        if (strictMode) {
          monitorAudio();
        }
      }, 2000);
    }
    
    return () => {
      if (faceDetectionRef.current) {
        clearInterval(faceDetectionRef.current);
      }
    };
  }, [cameraActive, isQuizActive, detectFace, monitorAudio, strictMode]);
  
  // System ready status
  useEffect(() => {
    const systemReady = cameraActive && (isFullscreen || !strictMode);
    onSystemReady(systemReady);
  }, [cameraActive, isFullscreen, strictMode, onSystemReady]);
  
  // Ensure video plays when stream is available
  useEffect(() => {
    if (videoRef.current && streamRef.current && cameraActive) {
      const video = videoRef.current;
      const stream = streamRef.current;
      
      const attemptPlay = async () => {
        try {
          if (video.paused && video.srcObject === stream) {
            await video.play();
            console.log('✅ Video auto-play successful');
          }
        } catch (error) {
          console.error('❌ Video auto-play failed:', error);
          // Try again after a short delay
          setTimeout(() => {
            if (video.paused) {
              video.play().catch(e => console.error('Retry play failed:', e));
            }
          }, 1000);
        }
      };
      
      attemptPlay();
    }
  }, [cameraActive]);
  
  // Generate anti-cheat report
  const generateReport = (): AntiCheatReport => {
    const now = new Date();
    const sessionDuration = (now.getTime() - sessionStartTime.getTime()) / 1000 / 60; // minutes
    const cameraUptime = cameraActive ? sessionDuration : 0;
    
    return {
      violations,
      totalViolations: violations.length,
      riskScore: Math.min(100, violations.reduce((score, v) => {
        return score + (v.severity === 'high' ? 30 : v.severity === 'medium' ? 15 : 5);
      }, 0)),
      sessionDuration,
      cameraUptime,
      tabSwitches: tabSwitchCount,
      suspiciousActivity: violations.some(v => v.severity === 'high')
    };
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Anti-Cheat Proctoring System
          </CardTitle>
          <CardDescription>
            Real-time monitoring to ensure quiz integrity
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* System Status */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2">
              <Camera className={`w-4 h-4 ${cameraActive ? 'text-green-500' : 'text-red-500'}`} />
              <span className="text-sm">Camera</span>
              <Badge variant={cameraActive ? 'default' : 'destructive'}>
                {cameraActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {faceDetected ? <Eye className="w-4 h-4 text-green-500" /> : <EyeOff className="w-4 h-4 text-red-500" />}
              <span className="text-sm">Face</span>
              <Badge variant={faceDetected ? 'default' : 'destructive'}>
                {faceDetected ? 'Detected' : 'Not Found'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {isFullscreen ? <Maximize className="w-4 h-4 text-green-500" /> : <Minimize className="w-4 h-4 text-yellow-500" />}
              <span className="text-sm">Fullscreen</span>
              <Badge variant={isFullscreen ? 'default' : 'secondary'}>
                {isFullscreen ? 'Active' : 'Inactive'}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              {isWindowFocused ? <Lock className="w-4 h-4 text-green-500" /> : <Unlock className="w-4 h-4 text-red-500" />}
              <span className="text-sm">Focus</span>
              <Badge variant={isWindowFocused ? 'default' : 'destructive'}>
                {isWindowFocused ? 'Focused' : 'Lost'}
              </Badge>
            </div>
          </div>
          
          {/* Camera Feed */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              {cameraActive ? (
                <div className="relative w-full max-w-sm">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-auto rounded-lg border-2 border-gray-300 shadow-lg"
                    style={{ 
                      minHeight: '200px',
                      maxWidth: '400px',
                      transform: 'scaleX(-1)' 
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <Badge variant={faceDetected ? 'default' : 'destructive'}>
                      {faceDetected ? 'Face Detected' : 'No Face'}
                    </Badge>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge variant="secondary" className="bg-black/70 text-white">
                      🔴 Live
                    </Badge>
                  </div>
                  {/* Debug info */}
                  <div className="absolute bottom-2 right-2 text-xs bg-black/70 text-white px-2 py-1 rounded">
                    {videoRef.current?.videoWidth}x{videoRef.current?.videoHeight}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full max-w-sm h-48 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-800">
                  <div className="text-center">
                    <Camera className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Camera not active</p>
                    <p className="text-xs text-gray-400">Click "Start Camera" to begin</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="space-y-2">
                <Button 
                  onClick={cameraActive ? stopCamera : initializeCamera}
                  variant={cameraActive ? "destructive" : "default"}
                  className="w-full"
                  disabled={cameraPermission === 'denied'}
                >
                  {cameraActive ? (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Stop Camera
                    </>
                  ) : (
                    <>
                      <Camera className="w-4 h-4 mr-2" />
                      Start Camera
                    </>
                  )}
                </Button>
                
                {cameraPermission === 'denied' && (
                  <Alert variant="destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="text-xs">
                      Camera permission denied. Please refresh and allow camera access.
                    </AlertDescription>
                  </Alert>
                )}
                
                {strictMode && (
                  <Button 
                    onClick={isFullscreen ? exitFullscreen : enterFullscreen}
                    variant={isFullscreen ? "secondary" : "default"}
                    className="w-full"
                  >
                    {isFullscreen ? (
                      <>
                        <Minimize className="w-4 h-4 mr-2" />
                        Exit Fullscreen
                      </>
                    ) : (
                      <>
                        <Maximize className="w-4 h-4 mr-2" />
                        Enter Fullscreen
                      </>
                    )}
                  </Button>
                )}
              </div>
              
              {/* Violation Summary */}
              <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-medium mb-2">Session Summary</h4>
                <div className="text-sm space-y-1">
                  <div>Violations: {violations.length}</div>
                  <div>Tab Switches: {tabSwitchCount}</div>
                  <div>Camera Uptime: {cameraActive ? '100%' : '0%'}</div>
                  <div className="text-xs text-gray-500 mt-2">
                    Status: {cameraPermission} | Stream: {streamRef.current ? 'Active' : 'None'}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Violations */}
          {violations.length > 0 && (
            <div>
              <h4 className="font-medium mb-2">Recent Violations</h4>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {violations.slice(-5).map((violation, index) => (
                  <Alert key={index} variant={violation.severity === 'high' ? 'destructive' : 'default'}>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription className="text-xs">
                      {violation.timestamp.toLocaleTimeString()}: {violation.description}
                    </AlertDescription>
                  </Alert>
                ))}
              </div>
            </div>
          )}
          
          {/* System Requirements Warning */}
          {(!cameraActive || (strictMode && !isFullscreen)) && (
            <Alert variant="destructive">
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Proctoring requirements not met. Please enable camera{strictMode && !isFullscreen && ' and fullscreen mode'} to continue.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AntiCheatSystem;
