import type { ProposalAttachment } from '../types';

/** Attachments may carry a signed URL or a storage-relative path. */
export function attachmentUrl(attachment: ProposalAttachment): string {
  const path = attachment.signedUrl || attachment.signed_url || attachment.file_path;
  if (!path) return '';
  if (path.startsWith('http')) return path;

  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/api$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
}

export interface NumberedProposal {
  proposalNumber: number;
  isLatest: boolean;
}

/** Number proposals chronologically (oldest is #1) and return newest first. */
export function numberProposals<T extends { id: string | number; created_at?: string }>(
  proposals: T[],
): Array<T & NumberedProposal> {
  const timeOf = (proposal: T) =>
    proposal.created_at ? new Date(proposal.created_at).getTime() : Number(proposal.id) || 0;

  return [...proposals]
    .sort((a, b) => timeOf(a) - timeOf(b))
    .map((proposal, index, all) => ({ ...proposal, proposalNumber: index + 1, isLatest: index === all.length - 1 }))
    .reverse();
}
