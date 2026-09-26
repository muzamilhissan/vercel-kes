import { useState } from 'react';
import { Button, Combobox, Input } from '@/shared/ui';
import { PREDEFINED_POSITIONS } from './schema';

const OTHER = 'Other';

const OPTIONS = [...PREDEFINED_POSITIONS.map((position) => ({ value: position, label: position })), {
  value: OTHER,
  label: OTHER,
}];

interface PositionFieldProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

/** A dropdown of common positions that switches to free text on "Other". */
export function PositionField({ value, onChange, disabled, id }: PositionFieldProps) {
  const isKnown = PREDEFINED_POSITIONS.includes(value as (typeof PREDEFINED_POSITIONS)[number]);
  const [isCustom, setIsCustom] = useState(Boolean(value) && !isKnown);

  if (isCustom) {
    return (
      <div className="flex gap-2">
        <Input
          id={id}
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Enter custom position"
          disabled={disabled}
          className="flex-1"
        />
        <Button
          variant="subtle"
          size="sm"
          disabled={disabled}
          onClick={() => {
            setIsCustom(false);
            onChange('');
          }}
        >
          Cancel
        </Button>
      </div>
    );
  }

  return (
    <Combobox
      id={id}
      options={OPTIONS}
      value={isKnown ? value : ''}
      placeholder="Select position"
      disabled={disabled}
      onChange={(next) => {
        if (next === OTHER) {
          setIsCustom(true);
          onChange('');
        } else {
          onChange(next);
        }
      }}
    />
  );
}
