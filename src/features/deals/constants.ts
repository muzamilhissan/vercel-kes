import type { BadgeTone } from '@/shared/ui';

export const DEAL_STAGES = ['New', 'In-progress', 'Won', 'Lost'] as const;

export const STAGE_OPTIONS = DEAL_STAGES.map((stage) => ({ value: stage, label: stage }));

/** Badge colour for a stage name, tolerant of the variants the API returns. */
export function stageTone(stage: string): BadgeTone {
  const value = stage.toLowerCase();
  if (value.includes('won') || value.includes('done')) return 'success';
  if (value.includes('progress') || value.includes('process')) return 'warning';
  if (value.includes('new') || value.includes('to do')) return 'info';
  return 'brand';
}
