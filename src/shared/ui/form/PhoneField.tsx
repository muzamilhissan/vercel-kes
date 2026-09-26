import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import { cn } from '@/shared/lib/cn';

export { isValidPhoneNumber };

export const DEFAULT_COUNTRY = 'ZA' as const;

interface PhoneFieldProps {
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  invalid?: boolean;
  placeholder?: string;
  id?: string;
  'aria-describedby'?: string;
}

/** International phone entry, styled to match the other form controls. */
export function PhoneField({ value, onChange, invalid, ...props }: PhoneFieldProps) {
  return (
    <PhoneInput
      international={false}
      defaultCountry={DEFAULT_COUNTRY}
      value={value}
      onChange={onChange}
      placeholder={props.placeholder ?? 'Enter phone number'}
      className={cn('phone-field', invalid && 'phone-field-invalid')}
      {...props}
    />
  );
}
