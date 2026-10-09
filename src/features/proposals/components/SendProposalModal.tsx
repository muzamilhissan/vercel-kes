import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, Loader2, Send, Sparkles } from 'lucide-react';
import { Button, Modal } from '@/shared/ui';
import { toast } from '@/shared/toast';
import { SelectDocumentsModal } from '@/features/documents/components/SelectDocumentsModal';
import type { CompanyDocument } from '@/features/documents/types';
import type { Lead } from '@/features/leads/types';
import { useGenerateProposal, useProposalOptions, useProposals } from '../hooks/useProposals';
import { GeneratingState } from './GeneratingState';
import { ProposalQuestionnaireStep, type QuestionnaireValue } from './ProposalQuestionnaireStep';
import { ProposalReviewStep, type ProposalDraft } from './ProposalReviewStep';
import { ProposalStepper } from './ProposalStepper';

const EMPTY_QUESTIONNAIRE: QuestionnaireValue = {
  serviceIds: [],
  mainPurposeId: null,
  commercialApproachId: null,
};

const EMPTY_DRAFT: ProposalDraft = { subject: '', content: '', files: [], libraryDocs: [] };

function buildFormData({ subject, content, files, libraryDocs }: ProposalDraft): FormData {
  const body = new FormData();
  body.append('email_content', JSON.stringify({ subject, body: content }));
  files.forEach((file, index) => body.append(`additional_attachments[${index}]`, file));
  libraryDocs.forEach((doc, index) =>
    body.append(`company_document_ids[${index}]`, String(doc.id)),
  );
  return body;
}

interface SendProposalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead;
  isRepropose?: boolean;
  proposalNumber?: number;
  onSuccess: () => void;
}

export function SendProposalModal({
  open,
  onOpenChange,
  lead,
  isRepropose = false,
  proposalNumber = 1,
  onSuccess,
}: SendProposalModalProps) {
  const [step, setStep] = useState<1 | 2>(1);
  const [questionnaire, setQuestionnaire] = useState(EMPTY_QUESTIONNAIRE);
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);
  const [proposalId, setProposalId] = useState<string | number | null>(null);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);

  const options = useProposalOptions();
  const generate = useGenerateProposal(lead.id);
  const { send } = useProposals(lead.id);

  const label = isRepropose ? `Proposal #${proposalNumber}` : 'Proposal';

  useEffect(() => {
    if (!open) return;
    setStep(1);
    setDraft(EMPTY_DRAFT);
    setGeneratedPdfUrl(null);
    setProposalId(null);
  }, [open]);

  const canGenerate =
    questionnaire.serviceIds.length > 0 && questionnaire.mainPurposeId !== null && questionnaire.commercialApproachId !== null;

  const handleGenerate = async () => {
    if (!canGenerate) {
      if (questionnaire.serviceIds.length === 0) toast.error('Please select at least one service');
      else if (!questionnaire.mainPurposeId) toast.error('Please select the main purpose');
      else toast.error('Please select a commercial approach');
      return;
    }

    try {
      const generated = await generate.mutateAsync({
        service_ids: questionnaire.serviceIds,
        main_purpose_id: questionnaire.mainPurposeId!,
        commercial_approach_id: questionnaire.commercialApproachId!,
      });

      setDraft((current) => ({
        ...current,
        subject: generated.email_subject || '',
        content: generated.email_body || '',
      }));
      setGeneratedPdfUrl(generated.proposal_download_url || null);
      setProposalId(generated.id);
      setStep(2);
    } catch {
      return;
    }
  };

  const handleSend = async () => {
    if (!draft.subject.trim()) return toast.error('Subject is required');
    if (!draft.content.trim()) return toast.error('Proposal Content is required');

    if (!proposalId) return toast.error('Generate the proposal before sending it.');

    try {
      await send.mutateAsync({ id: proposalId, body: buildFormData(draft) });
    } catch {
      return;
    }

    toast.success(`${label} sent successfully!`);
    setDraft(EMPTY_DRAFT);
    setGeneratedPdfUrl(null);
    setProposalId(null);
    onSuccess();
  };

  const isBusy = generate.isPending || send.isPending;

  return (
    <>
      <Modal
        open={open}
        onOpenChange={onOpenChange}
        title={isRepropose ? 'Re-propose Lead' : 'Send Proposal'}
        description={`Lead: ${lead.name}${lead.company ? ` (${lead.company})` : ''}`}
        size="xl"
        dismissible={!isBusy}
        footer={
          step === 1 ? (
            <>
              <Button variant="subtle" disabled={generate.isPending} onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button variant="ghost" disabled={generate.isPending} onClick={() => setStep(2)}>
                Skip to blank form →
              </Button>
              <Button disabled={!canGenerate || generate.isPending} onClick={handleGenerate}>
                <Sparkles size={16} />
                Generate {label}
                <ArrowRight size={15} />
              </Button>
            </>
          ) : (
            <>
              <Button variant="subtle" disabled={send.isPending} onClick={() => setStep(1)}>
                <ArrowLeft size={16} />
                Back to Requirements
              </Button>
              <Button disabled={send.isPending} onClick={handleSend}>
                {send.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {send.isPending ? 'Sending...' : `Send ${label}`}
              </Button>
            </>
          )
        }
      >
        <ProposalStepper
          currentStep={step}
          onStepClick={setStep}
          steps={[
            { name: 'Step 1: Requirements', hint: `${isRepropose ? 'Adjust' : 'Select'} scope & parameters` },
            {
              name: 'Step 2: Review & Send',
              hint: isRepropose ? `Review ${label}` : 'Review generated content',
            },
          ]}
        />

        {generate.isPending ? (
          <GeneratingState
            title={`Generating ${label} with AI...`}
            target={lead.company || lead.name}
            documentNoun={isRepropose ? 're-proposal' : 'proposal'}
          />
        ) : step === 1 ? (
          <ProposalQuestionnaireStep
            options={options.data}
            isLoading={options.isPending}
            isError={options.isError}
            onRetry={() => options.refetch()}
            value={questionnaire}
            onChange={setQuestionnaire}
          />
        ) : (
          <ProposalReviewStep
            draft={draft}
            onChange={setDraft}
            isSubmitting={send.isPending}
            generatedPdfUrl={generatedPdfUrl}
            proposalLabel={label}
            onBrowseLibrary={() => setIsLibraryOpen(true)}
          />
        )}
      </Modal>

      <SelectDocumentsModal
        open={isLibraryOpen}
        onOpenChange={setIsLibraryOpen}
        onSelect={(documents: CompanyDocument[]) =>
          setDraft((current) => {
            const existing = new Set(current.libraryDocs.map((doc) => doc.id));
            return { ...current, libraryDocs: [...current.libraryDocs, ...documents.filter((doc) => !existing.has(doc.id))] };
          })
        }
      />
    </>
  );
}
