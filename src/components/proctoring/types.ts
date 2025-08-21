export interface ViolationType {
  type: 'tab_switch' | 'face_not_detected' | 'multiple_faces' | 'fullscreen_exit' | 'audio_suspicious' | 'window_blur' | 'right_click' | 'key_combination' | 'copy_paste';
  timestamp: Date;
  description: string;
  severity: 'low' | 'medium' | 'high';
}

export interface AntiCheatReport {
  violations: ViolationType[];
  totalViolations: number;
  riskScore: number;
  sessionDuration: number;
  cameraUptime: number;
  tabSwitches: number;
  suspiciousActivity: boolean;
}

export const generateAntiCheatReport = (
  violations: ViolationType[], 
  sessionStartTime: Date, 
  cameraActive: boolean, 
  tabSwitchCount: number
): AntiCheatReport => {
  const now = new Date();
  const sessionDuration = (now.getTime() - sessionStartTime.getTime()) / 1000 / 60;
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
