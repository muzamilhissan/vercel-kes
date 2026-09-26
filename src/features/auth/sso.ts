import { authApi } from './api/authApi';
import { toast } from '@/shared/toast';

const POMS_URL = import.meta.env.VITE_KUDON_POMS_URL || 'http://localhost';

/** Only this account sees the POMS switcher today. */
export const POMS_ALLOWED_EMAIL = 'zubairnaeem45@gmail.com';

/** Hand the current session over to Kudon-POMS via a one-time switch token. */
export async function redirectToKudonPOMS(): Promise<void> {
  try {
    const { switch_token } = await authApi.generateSwitchToken();
    if (!switch_token) throw new Error('No switch token received from server.');
    window.location.href = `${POMS_URL}/auth/sso-login?token=${switch_token}`;
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'Failed to redirect to POMS. Please try again.');
    throw error;
  }
}
