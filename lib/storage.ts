import { NIHSSAssessment } from './nihss';

const STORAGE_KEY = 'nihss-assessments';
const DEVICE_ID_KEY = 'nihss-device-id';

export function getDeviceId(): string {
  if (typeof window === 'undefined') return '';
  
  let deviceId = localStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = `device-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem(DEVICE_ID_KEY, deviceId);
  }
  return deviceId;
}

export function saveAssessment(assessment: NIHSSAssessment): void {
  if (typeof window === 'undefined') return;
  
  const assessments = getAssessments();
  assessments.unshift(assessment); // Add to beginning
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
}

export function getAssessments(): NIHSSAssessment[] {
  if (typeof window === 'undefined') return [];
  
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  try {
    return JSON.parse(stored) as NIHSSAssessment[];
  } catch {
    return [];
  }
}

export function getAssessmentById(id: string): NIHSSAssessment | undefined {
  return getAssessments().find(a => a.id === id);
}

export function deleteAssessment(id: string): void {
  if (typeof window === 'undefined') return;
  
  const assessments = getAssessments().filter(a => a.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(assessments));
}

export function clearAllAssessments(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

export function exportAssessments(): string {
  return JSON.stringify(getAssessments(), null, 2);
}
