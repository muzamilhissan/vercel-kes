import { apiFetch } from './apiClient';
import { ApiResponse, Contact, CreateContactInput, UpdateContactInput } from './types';

export const contactService = {
  /**
   * Get all contacts.
   * GET /contacts/list
   */
  async list(page?: number, perPage?: number, search?: string): Promise<ApiResponse<Contact[]>> {
    const params: Record<string, string> = {};
    if (page !== undefined) params.page = String(page);
    if (perPage !== undefined) params.per_page = String(perPage);
    if (search !== undefined && search.trim() !== '') params.search = search;
    return apiFetch<ApiResponse<Contact[]>>('/contacts/list', { params });
  },

  /**
   * Get details of a specific contact by ID.
   * GET /contacts/show/:id
   */
  async show(id: string | number): Promise<ApiResponse<Contact>> {
    return apiFetch<ApiResponse<Contact>>(`/contacts/show/${id}`);
  },

  /**
   * Store a new contact.
   * POST /contacts/store
   */
  async store(contactData: CreateContactInput): Promise<ApiResponse<Contact>> {
    return apiFetch<ApiResponse<Contact>>('/contacts/store', {
      method: 'POST',
      body: JSON.stringify(contactData),
    });
  },

  /**
   * Update an existing contact by ID.
   * PUT /contacts/update/:id
   */
  async update(id: string | number, contactData: UpdateContactInput): Promise<ApiResponse<Contact>> {
    return apiFetch<ApiResponse<Contact>>(`/contacts/update/${id}`, {
      method: 'PUT',
      body: JSON.stringify(contactData),
    });
  },

  /**
   * Delete a contact by ID.
   * DELETE /contacts/delete/:id
   */
  async delete(id: string | number): Promise<ApiResponse<void>> {
    return apiFetch<ApiResponse<void>>(`/contacts/delete/${id}`, {
      method: 'DELETE',
    });
  },
};
