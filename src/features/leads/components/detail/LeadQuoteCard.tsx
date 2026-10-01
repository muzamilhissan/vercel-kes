import { FileSpreadsheet, Loader2, Plus, RefreshCw } from 'lucide-react';
import { Badge } from '@/shared/ui';
import { formatDate } from '@/shared/lib/format';
import { toPOStatus, toneForPOStatus } from '@/features/quotes/constants';
import type { PurchaseOrder } from '@/features/quotes/types';
import { DetailCard, InfoRow } from './DetailCard';

interface LeadQuoteCardProps {
  purchaseOrders: PurchaseOrder[];
  isLoading: boolean;
  canCreate: boolean;
  isRefreshing: boolean;
  onCreateClick: () => void;
  onRefreshClick: (id: string | number) => void;
}

export function LeadQuoteCard({
  purchaseOrders,
  isLoading,
  canCreate,
  isRefreshing,
  onCreateClick,
  onRefreshClick,
}: LeadQuoteCardProps) {
  const [linked, ...earlier] = purchaseOrders;

  return (
    <DetailCard
      icon={FileSpreadsheet}
      title="Quote / PO"
      action={
        linked && (
          <button
            type="button"
            onClick={() => onRefreshClick(linked.id)}
            disabled={isRefreshing}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-2xs font-semibold text-brand transition-colors hover:bg-purple-50 disabled:opacity-60"
          >
            {isRefreshing ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
            Refresh status
          </button>
        )
      }
    >
      {isLoading ? (
        <p className="py-2 text-label text-ink-muted">Loading purchase orders...</p>
      ) : !linked ? (
        <div className="flex flex-col items-start gap-2 py-1">
          <p className="text-label text-ink-muted">
            {canCreate
              ? 'No PO raised for this lead yet.'
              : 'A PO can be raised once this lead is qualified.'}
          </p>
          {canCreate && (
            <button
              type="button"
              onClick={onCreateClick}
              className="flex items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-purple-100"
            >
              <Plus size={14} /> Create Quote
            </button>
          )}
        </div>
      ) : (
        <>
          <InfoRow label="PO Status:">
            <Badge tone={toneForPOStatus(linked.status)}>{toPOStatus(linked.status)}</Badge>
          </InfoRow>
          <InfoRow label="PO Number:">{linked.po_number || 'N/A'}</InfoRow>
          <InfoRow label="Invoice Number:">{linked.invoice_number || 'N/A'}</InfoRow>
          <InfoRow label="PO Owner:">{linked.po_owner || 'N/A'}</InfoRow>
          <InfoRow label="Site:">{linked.site || 'N/A'}</InfoRow>
          <InfoRow label="Delivery:">
            {linked.delivery_option === 'Collection'
              ? 'Collection from site'
              : linked.delivery_address || linked.delivery_option || 'N/A'}
          </InfoRow>
          <InfoRow label="Created:">{formatDate(linked.created_at)}</InfoRow>

          {earlier.length > 0 && (
            <div className="mt-2 flex flex-col gap-1.5 border-t border-field pt-2">
              <span className="text-label font-medium text-ink-muted">Earlier POs:</span>
              {earlier.map((po) => (
                <span key={po.id} className="flex items-center justify-between gap-2 text-label">
                  <span className="truncate font-medium text-slate-700">{po.po_number}</span>
                  <Badge tone={toneForPOStatus(po.status)}>{toPOStatus(po.status)}</Badge>
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </DetailCard>
  );
}
