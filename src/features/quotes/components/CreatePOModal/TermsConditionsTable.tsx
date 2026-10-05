import { useFieldArray, type Control, type FieldErrors } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import { CONTROL_BASE, CONTROL_INVALID } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { EMPTY_CONDITION, type CreatePOValues } from './schema';

interface TermsConditionsTableProps {
  control: Control<CreatePOValues>;
  errors: FieldErrors<CreatePOValues>['conditions'];
  register: (name: `conditions.${number}.${'label' | 'description'}`) => Record<string, unknown>;
  disabled?: boolean;
}

export function TermsConditionsTable({ control, errors, register, disabled }: TermsConditionsTableProps) {
  const { fields, append, remove } = useFieldArray({ control, name: 'conditions' });

  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h4 className="text-label font-semibold text-slate-600">Terms &amp; Conditions</h4>
          <p className="text-xs text-ink-muted">Conditions that travel with this PO.</p>
        </div>
        <button
          type="button"
          disabled={disabled}
          onClick={() => append(EMPTY_CONDITION)}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-purple-300 bg-purple-50 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-purple-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={14} /> Add Condition
        </button>
      </header>

      <div className="overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-surface-muted text-left">
              <th scope="col" className="w-10 px-3 py-2 text-xs font-semibold text-ink-muted">
                #
              </th>
              <th scope="col" className="px-3 py-2 text-xs font-semibold text-ink-muted sm:w-1/3">
                Label
              </th>
              <th scope="col" className="px-3 py-2 text-xs font-semibold text-ink-muted">
                Description
              </th>
              <th scope="col" className="w-12 px-3 py-2">
                <span className="sr-only">Remove</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {fields.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-xs text-ink-muted">
                  No conditions added yet. Use “Add Condition” to add the first one.
                </td>
              </tr>
            ) : (
              fields.map((field, index) => {
                const rowErrors = errors?.[index];
                return (
                  <tr key={field.id} className="border-t border-line align-top">
                    <td className="px-3 py-2 text-xs font-semibold text-ink-muted">{index + 1}</td>
                    <td className="px-3 py-2">
                      <input
                        {...register(`conditions.${index}.label`)}
                        aria-label={`Condition ${index + 1} label`}
                        aria-invalid={Boolean(rowErrors?.label)}
                        placeholder="e.g. Warranty"
                        disabled={disabled}
                        className={cn(CONTROL_BASE, 'py-1.5', rowErrors?.label && CONTROL_INVALID)}
                      />
                      {rowErrors?.label && <p className="mt-1 text-xs text-red-600">{rowErrors.label.message}</p>}
                    </td>
                    <td className="px-3 py-2">
                      <textarea
                        {...register(`conditions.${index}.description`)}
                        aria-label={`Condition ${index + 1} description`}
                        aria-invalid={Boolean(rowErrors?.description)}
                        rows={2}
                        placeholder="e.g. 12 months"
                        disabled={disabled}
                        className={cn(CONTROL_BASE, 'resize-y py-1.5', rowErrors?.description && CONTROL_INVALID)}
                      />
                      {rowErrors?.description && (
                        <p className="mt-1 text-xs text-red-600">{rowErrors.description.message}</p>
                      )}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        aria-label={`Remove condition ${index + 1}`}
                        disabled={disabled}
                        onClick={() => remove(index)}
                        className="grid size-8 place-items-center rounded-lg text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
