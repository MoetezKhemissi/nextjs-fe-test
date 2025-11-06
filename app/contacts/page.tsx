"use client";
import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useContacts } from "@/lib/hooks/useContacts";
import ContactItem from "@/components/ContactItem";
import Modal from "@/components/Modal";
import type { Contact } from "@/app/api/contacts/data";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function ContactsPage() {
  const { data, loading, error, validationErrors, update, remove, clearValidationErrors } = useContacts();
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Lead" as Contact["role"] });
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Filter contacts by name or email
  const filteredData = useMemo(() => {
    return data?.filter(contact => {
      const lowerQuery = query.toLowerCase();
      return (
        contact.name.toLowerCase().includes(lowerQuery) ||
        contact.email.toLowerCase().includes(lowerQuery)
      );
    }) ?? [];
  }, [data, query]);

  // Pagination logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  // Focus first input when modal opens
  useEffect(() => {
    if (editing && firstInputRef.current) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [editing]);

  // Auto-hide success message after 3 seconds
  useEffect(() => {
    if (saveSuccess) {
      const timer = setTimeout(() => setSaveSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [saveSuccess]);

  // Reset to page 1 when search query changes
  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
    setCurrentPage(1);
  }, []);

  // Handle edit button click
  const handleEdit = useCallback((contact: Contact) => {
    setEditing(contact);
    setForm({ name: contact.name, email: contact.email, role: contact.role });
    clearValidationErrors();
    setSaveSuccess(false);
  }, [clearValidationErrors]);

  // Handle save button click
  const handleSave = useCallback(async () => {
    if (!editing) return;

    setIsSaving(true);
    const result = await update(editing.id, form);
    setIsSaving(false);

    if (result?.success) {
      setSaveSuccess(true);
      setEditing(null);
    }
  }, [editing, form, update]);

  // Check if form has changed
  const isDirty = useMemo(() => {
    if (!editing) return false;
    return (
      form.name !== editing.name ||
      form.email !== editing.email ||
      form.role !== editing.role
    );
  }, [editing, form]);

  // Handle modal close
  const handleCloseModal = useCallback(() => {
    setEditing(null);
    clearValidationErrors();
    setSaveSuccess(false);
  }, [clearValidationErrors]);

  // Handle items per page change
  const handleItemsPerPageChange = useCallback((newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-3xl p-6">
        <h1 className="mb-6 text-3xl font-bold text-blue-900">Contacts</h1>

      {saveSuccess && (
        <div className="mb-4 rounded-lg bg-green-50 p-3 text-green-800 border border-green-200" role="alert">
          ✓ Contact updated successfully!
        </div>
      )}

      <div className="mb-4 flex items-center gap-4">
        <input
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name or email…"
          className="text-black flex-1 rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
          aria-label="Search contacts by name or email"
        />
        <div className="flex items-center gap-2">
          <label htmlFor="items-per-page" className="text-sm font-medium text-gray-700 whitespace-nowrap">
            Items per page:
          </label>
          <select
            id="items-per-page"
            value={itemsPerPage}
            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
            className="text-black rounded-lg border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-label="Select items per page"
          >
            {ITEMS_PER_PAGE_OPTIONS.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="text-gray-500" role="status" aria-live="polite">Loading…</div>}
      {error && <div className="text-red-600" role="alert" aria-live="assertive">Error: {error}</div>}

      {!loading && !error && paginatedData.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <span role="img" aria-label="empty mailbox" className="mb-3 text-5xl text-gray-300">📭</span>
          <h3 className="mb-1 text-lg font-semibold text-gray-700">No contacts found</h3>
          <p className="text-sm text-gray-500">
            {query ? "Try adjusting your search" : "Start by adding some contacts"}
          </p>
        </div>
      )}

      <div className="space-y-3 bg-white rounded-lg p-4 shadow-sm" role="list" aria-label="Contacts list">
        {paginatedData.map(contact => (
          <ContactItem
            key={contact.id}
            contact={contact}
            onEdit={handleEdit}
            onDelete={remove}
          />
        ))}
      </div>

      {!loading && !error && filteredData.length > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between border-t pt-4 bg-white">
          <div className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} contacts
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Previous page"
            >
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border px-3 py-1 text-sm font-medium transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-transparent"
              aria-label="Next page"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <Modal open={!!editing} onClose={handleCloseModal} title="Edit contact">
        {editing && (
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div>
              <label htmlFor="contact-name" className="mb-1 block text-sm font-semibold text-black">Name</label>
              <input
                ref={firstInputRef}
                id="contact-name"
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full rounded-lg border-2 px-3 py-2 text-black bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                  validationErrors?.name ? "border-red-500" : "border-gray-300"
                }`}
                required
                aria-required="true"
                aria-invalid={!!validationErrors?.name}
                aria-describedby={validationErrors?.name ? "name-error" : undefined}
              />
              {validationErrors?.name && (
                <p id="name-error" className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-email" className="mb-1 block text-sm font-semibold text-black">Email</label>
              <input
                id="contact-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full rounded-lg border-2 px-3 py-2 text-black bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                  validationErrors?.email ? "border-red-500" : "border-gray-300"
                }`}
                required
                aria-required="true"
                aria-invalid={!!validationErrors?.email}
                aria-describedby={validationErrors?.email ? "email-error" : undefined}
              />
              {validationErrors?.email && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.email}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="contact-role" className="mb-1 block text-sm font-semibold text-black">Role</label>
              <select
                id="contact-role"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as Contact["role"] })}
                className={`w-full rounded-lg border-2 px-3 py-2 text-black bg-white focus:border-black focus:outline-none focus:ring-2 focus:ring-gray-300 ${
                  validationErrors?.role ? "border-red-500" : "border-gray-300"
                }`}
                aria-required="true"
                aria-invalid={!!validationErrors?.role}
                aria-describedby={validationErrors?.role ? "role-error" : undefined}
              >
                <option value="Client">Client</option>
                <option value="Lead">Lead</option>
                <option value="Partner">Partner</option>
              </select>
              {validationErrors?.role && (
                <p id="role-error" className="mt-1 text-sm text-red-600" role="alert">
                  {validationErrors.role}
                </p>
              )}
            </div>
            {validationErrors?._general && (
              <div className="rounded-lg bg-red-50 p-3 text-red-800 border border-red-200" role="alert">
                {validationErrors._general}
              </div>
            )}
            <button
              type="submit"
              disabled={!isDirty || isSaving}
              className="w-full rounded-lg bg-black px-4 py-2.5 font-semibold text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-black"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </form>
        )}
      </Modal>
    </div>
    </div>
  );
}
