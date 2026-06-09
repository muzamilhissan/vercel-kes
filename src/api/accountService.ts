import { apiFetch } from './apiClient';
import { ApiResponse, Account, CreateAccountInput, UpdateAccountInput } from './types';

export const accountService = {
  /**
   * Get all accounts.
   * GET /accounts/list
   */
  async list(): Promise<ApiResponse<Account[]>> {
    return apiFetch<ApiResponse<Account[]>>('/accounts/list');
  },

  /**
   * Get details of a specific account by ID.
   * GET /accounts/show/:id
   */
  async show(id: string | number): Promise<ApiResponse<Account>> {
    return apiFetch<ApiResponse<Account>>(`/accounts/show/${id}`);
  },

  /**
   * Store a new account.
   * POST /accounts/store
   */
  async store(accountData: CreateAccountInput): Promise<ApiResponse<Account>> {
    return apiFetch<ApiResponse<Account>>('/accounts/store', {
      method: 'POST',
      body: JSON.stringify(accountData),
    });
  },

  /**
   * Update an existing account by ID.
   * PUT /accounts/update/:id
   */
  async update(id: string | number, accountData: UpdateAccountInput): Promise<ApiResponse<Account>> {
    return apiFetch<ApiResponse<Account>>(`/accounts/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(accountData),
    });
  },

  /**
   * Delete an account by ID.
   * DELETE /accounts/delete/:id
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return apiFetch<ApiResponse<void>>(`/accounts/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
