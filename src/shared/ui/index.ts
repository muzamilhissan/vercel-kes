// Grouped by role: form controls, data display, overlays, feedback, and the
// generic primitives at the root. Import from '@/shared/ui' rather than the
// individual files so the grouping stays an implementation detail.
//
// Exception: modules in the eager graph (app/, and anything routes.tsx imports
// without lazy()) must import the specific file. Pulling this barrel in there
// drags every component into the entry chunk and defeats per-route splitting.
export { Button, type ButtonProps } from './Button';
export { IconButton } from './IconButton';
export { PageHeader } from './PageHeader';

export { Combobox, type ComboboxOption } from './form/Combobox';
export { DateFilter } from './form/DateFilter';
export { Field, Input, NativeSelect, Textarea, CONTROL_BASE, CONTROL_INVALID } from './form/Field';
export { PhoneField, isValidPhoneNumber, DEFAULT_COUNTRY } from './form/PhoneField';

export { Avatar, initialsOf } from './data/Avatar';
export { Badge, type BadgeTone } from './data/Badge';
export { DataTable, type Column } from './data/DataTable';
export { DetailList, type DetailItem } from './data/DetailList';
export { Pagination } from './data/Pagination';

export { ConfirmDialog } from './overlay/ConfirmDialog';
export { Modal, ModalGrid } from './overlay/Modal';

export { ErrorState } from './feedback/ErrorState';
export { Loader, FullScreenLoader } from './feedback/Loader';

export { useSortable, type SortState } from '@/shared/hooks/useSortable';
export { useClientPagination, DEFAULT_CLIENT_PAGE_SIZE } from '@/shared/hooks/useClientPagination';
