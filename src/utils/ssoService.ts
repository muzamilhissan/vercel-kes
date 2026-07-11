import { authService } from '../api/authService';

const KUDON_POMS_URL = import.meta.env.VITE_KUDON_POMS_URL || 'http://localhost';

/**
 * Redirect the current user to Kudon-POMS with SSO token
 */
export const redirectToKudonPOMS = async (): Promise<void> => {
  try {
    // Generate switch token from backend
    const response = await authService.generateSwitchToken();
    
    if (response.switch_token) {
      // Redirect to Kudon-POMS with the token
      const url = `${KUDON_POMS_URL}/auth/sso-login?token=${response.switch_token}`;
      window.location.href = url;
    } else {
      throw new Error('No switch token received from server');
    }
  } catch (error: any) {
    console.error('Error redirecting to Kudon-POMS:', error);
    alert('Failed to redirect to POMS. Please try again.');
    throw error;
  }
};
