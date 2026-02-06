export interface NIHSSItem {
  id: string;
  name: string;
  description: string;
  maxScore: number;
  options: {
    value: number;
    label: string;
    description?: string;
  }[];
}

export interface NIHSSAssessment {
  id: string;
  timestamp: number;
  totalScore: number;
  severity: 'minor' | 'mild' | 'moderate' | 'severe';
  items: Record<string, number>;
  notes?: string;
}

export const NIHSS_ITEMS: NIHSSItem[] = [
  {
    id: 'loc',
    name: 'Level of Consciousness',
    description: 'Assess level of alertness',
    maxScore: 3,
    options: [
      { value: 0, label: 'Alert', description: 'Fully alert and responsive' },
      { value: 1, label: 'Drowsy', description: 'Not alert, but arousable with minor stimulation' },
      { value: 2, label: 'Stuporous', description: 'Not alert, requires repeated stimulation' },
      { value: 3, label: 'Coma', description: 'Unresponsive or responds only with reflex' },
    ],
  },
  {
    id: 'locQuestions',
    name: 'LOC Questions',
    description: 'Ask month and age. Score 0-2',
    maxScore: 2,
    options: [
      { value: 0, label: 'Answers both correctly' },
      { value: 1, label: 'Answers one correctly' },
      { value: 2, label: 'Answers neither correctly' },
    ],
  },
  {
    id: 'locCommands',
    name: 'LOC Commands',
    description: 'Open/close eyes, grip/non-grip hand. Score 0-2',
    maxScore: 2,
    options: [
      { value: 0, label: 'Performs both tasks correctly' },
      { value: 1, label: 'Performs one task correctly' },
      { value: 2, label: 'Performs neither correctly' },
    ],
  },
  {
    id: 'gaze',
    name: 'Best Gaze',
    description: 'Test horizontal eye movements',
    maxScore: 2,
    options: [
      { value: 0, label: 'Normal', description: 'Eyes move normally' },
      { value: 1, label: 'Partial gaze palsy', description: 'Gaze abnormal in one or both eyes' },
      { value: 2, label: 'Forced deviation', description: 'Gaze fixed in one direction' },
    ],
  },
  {
    id: 'visual',
    name: 'Best Visual',
    description: 'Test visual fields',
    maxScore: 3,
    options: [
      { value: 0, label: 'No visual loss' },
      { value: 1, label: 'Partial hemianopia', description: 'Visual field deficit in one quadrant' },
      { value: 2, label: 'Complete hemianopia', description: 'Visual field deficit in half of visual field' },
      { value: 3, label: 'Bilateral hemianopia', description: 'Blind or bilateral visual loss' },
    ],
  },
  {
    id: 'facial',
    name: 'Facial Palsy',
    description: 'Test facial symmetry',
    maxScore: 3,
    options: [
      { value: 0, label: 'Normal', description: 'Symmetric movements' },
      { value: 1, label: 'Minor', description: 'Minor paralysis (flattened nasolabial fold)' },
      { value: 2, label: 'Partial', description: 'Partial paralysis (total or near-total)' },
      { value: 3, label: 'Complete', description: 'Complete paralysis of one or both sides' },
    ],
  },
  {
    id: 'motorArmLeft',
    name: 'Motor Arm - Left',
    description: 'Test left arm strength (extend arms 90°, drift)',
    maxScore: 4,
    options: [
      { value: 0, label: 'No drift', description: 'Holds 90° (or 45° supine) for full 10 seconds' },
      { value: 1, label: 'Drift', description: 'Drifts but does not hit bed' },
      { value: 2, label: 'Some effort', description: 'Some effort against gravity, limb cannot get to position' },
      { value: 3, label: 'No effort', description: 'No effort against gravity' },
      { value: 4, label: 'No movement', description: 'No movement' },
    ],
  },
  {
    id: 'motorArmRight',
    name: 'Motor Arm - Right',
    description: 'Test right arm strength (extend arms 90°, drift)',
    maxScore: 4,
    options: [
      { value: 0, label: 'No drift' },
      { value: 1, label: 'Drift' },
      { value: 2, label: 'Some effort' },
      { value: 3, label: 'No effort' },
      { value: 4, label: 'No movement' },
    ],
  },
  {
    id: 'motorLegLeft',
    name: 'Motor Leg - Left',
    description: 'Test left leg strength (extend leg 30°, drift)',
    maxScore: 4,
    options: [
      { value: 0, label: 'No drift', description: 'Holds 30° for full 5 seconds' },
      { value: 1, label: 'Drift', description: 'Drifts but does not hit bed' },
      { value: 2, label: 'Some effort', description: 'Some effort against gravity' },
      { value: 3, label: 'No effort', description: 'No effort against gravity' },
      { value: 4, label: 'No movement', description: 'No movement' },
    ],
  },
  {
    id: 'motorLegRight',
    name: 'Motor Leg - Right',
    description: 'Test right leg strength (extend leg 30°, drift)',
    maxScore: 4,
    options: [
      { value: 0, label: 'No drift' },
      { value: 1, label: 'Drift' },
      { value: 2, label: 'Some effort' },
      { value: 3, label: 'No effort' },
      { value: 4, label: 'No movement' },
    ],
  },
  {
    id: 'ataxia',
    name: 'Limb Ataxia',
    description: 'Finger-nose and heel-shin test',
    maxScore: 2,
    options: [
      { value: 0, label: 'Absent', description: 'No ataxia or amputee/paralyzed' },
      { value: 1, label: 'Present in one limb' },
      { value: 2, label: 'Present in two limbs' },
    ],
  },
  {
    id: 'sensory',
    name: 'Sensory',
    description: 'Test pinprick or pin-touch',
    maxScore: 2,
    options: [
      { value: 0, label: 'Normal', description: 'Normal sensation' },
      { value: 1, label: 'Partial loss', description: 'Mild-to-moderate sensory loss' },
      { value: 2, label: 'Dense loss', description: 'Total or near-total sensory loss' },
    ],
  },
  {
    id: 'language',
    name: 'Best Language',
    description: 'Naming, spontaneous speech, comprehension',
    maxScore: 3,
    options: [
      { value: 0, label: 'No aphasia', description: 'Normal fluency and comprehension' },
      { value: 1, label: 'Mild-to-moderate', description: 'Some obvious loss of fluency' },
      { value: 2, label: 'Severe', description: 'Fragmentary expression, needs inference' },
      { value: 3, label: 'Mute/Global', description: 'No usable speech or comprehension' },
    ],
  },
  {
    id: 'dysarthria',
    name: 'Dysarthria',
    description: 'Test speech clarity (read/listen to words)',
    maxScore: 2,
    options: [
      { value: 0, label: 'Normal', description: 'Normal articulation' },
      { value: 1, label: 'Mild-to-moderate', description: 'Slurring but can be understood' },
      { value: 2, label: 'Severe', description: 'Speech so slurred as to be unintelligible' },
    ],
  },
  {
    id: 'extinction',
    name: 'Extinction & Inattention',
    description: 'Visual, tactile, auditory, spatial',
    maxScore: 2,
    options: [
      { value: 0, label: 'No abnormality', description: 'No neglect in any modality' },
      { value: 1, label: 'Inattention', description: 'Inattention or extinction to bilateral simultaneous stimulation' },
      { value: 2, label: 'Profound hemi-inattention', description: 'Profound hemi-inattention or extinction' },
    ],
  },
];

export function getSeverity(score: number): NIHSSAssessment['severity'] {
  if (score === 0) return 'minor';
  if (score <= 4) return 'mild';
  if (score <= 15) return 'moderate';
  return 'severe';
}

export function getSeverityLabel(severity: NIHSSAssessment['severity']): string {
  const labels = {
    minor: 'No Stroke (0)',
    mild: 'Mild (1-4)',
    moderate: 'Moderate (5-15)',
    severe: 'Severe (16-42)',
  };
  return labels[severity];
}

export function calculateTotal(items: Record<string, number>): number {
  return Object.values(items).reduce((sum, val) => sum + (val || 0), 0);
}
