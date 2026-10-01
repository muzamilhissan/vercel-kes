import { Briefcase, Building, Contact, Settings, Users, type LucideIcon } from 'lucide-react';

export interface NavLinkItem {
  to: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

/** Single source of truth for the sidebar links and the header's page titles. */
export const NAV_ITEMS: NavLinkItem[] = [
  { to: '/leads', label: 'Leads', icon: Users },
  { to: '/deals', label: 'Deals', icon: Briefcase },
  { to: '/contacts', label: 'Contacts', icon: Contact },
  { to: '/accounts', label: 'Accounts', icon: Building },
  { to: '/admin-configurations', label: 'Admin Configurations', icon: Settings, adminOnly: true },
];
