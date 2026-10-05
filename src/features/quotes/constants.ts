export const PO_OWNERS = ['Kudon', 'Bashumi'] as const;
export type POOwner = (typeof PO_OWNERS)[number];

export const PO_DELIVERY_OPTIONS = [
  { id: 1, label: 'Client to collect' },
  { id: 2, label: 'Input manually' },
  { id: 3, label: "Extract from client's address" },
] as const;

export const DELIVERY_OPTION_MANUAL = 2;
