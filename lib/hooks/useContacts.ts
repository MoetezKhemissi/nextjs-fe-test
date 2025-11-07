"use client";
import { useEffect, useState, useCallback } from "react";
import type { Contact } from "@/app/api/contacts/data";

type State = {
  data: Contact[] | null;
  loading: boolean;
  error: string | null;
  validationErrors: Record<string, string> | null;
};

export function useContacts() {
  const [state, setState] = useState<State>({
    data: null,
    loading: true,
    error: null,
    validationErrors: null
  });

  const reload = useCallback(async () => {
    setState({ data: null, loading: true, error: null, validationErrors: null });
    try {
      const res = await fetch("/api/contacts");
      if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
      const json = await res.json();
      setState({ data: json.data, loading: false, error: null, validationErrors: null });
    } catch (err) {
      setState({ data: null, loading: false, error: String(err), validationErrors: null });
    }
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const update = useCallback(async (id: string, patch: Partial<Contact>) => {
    // Optimistic update: immediately update UI
    const previousData = state.data;
    if (previousData) {
      const optimisticData = previousData.map(contact =>
        contact.id === id ? { ...contact, ...patch } : contact
      );
      setState(prev => ({ ...prev, data: optimisticData, error: null, validationErrors: null }));
    }

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });

      if (!res.ok) {
        // Handle validation errors (422)
        if (res.status === 422) {
          const errorData = await res.json();
          if (previousData) {
            setState(prev => ({
              ...prev,
              data: previousData,
              error: null,
              validationErrors: errorData.errors || { _general: errorData.message || "Validation failed" }
            }));
          }
          return { success: false, validationErrors: errorData.errors };
        }
        throw new Error(`Failed to update: ${res.statusText}`);
      }

      // Fetch fresh data to confirm
      await reload();
      return { success: true };
    } catch (err) {
      // Rollback on error
      if (previousData) {
        setState(prev => ({ ...prev, data: previousData, error: String(err), validationErrors: null }));
      } else {
        setState(prev => ({ ...prev, error: String(err), validationErrors: null }));
      }
      return { success: false, error: String(err) };
    }
  }, [reload, state.data]);

  const remove = useCallback(async (id: string) => {
    // Optimistic delete: immediately remove from UI
    const previousData = state.data;
    if (previousData) {
      const optimisticData = previousData.filter(contact => contact.id !== id);
      setState(prev => ({ ...prev, data: optimisticData, error: null, validationErrors: null }));
    }

    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`Failed to delete: ${res.statusText}`);
      // Fetch fresh data to confirm
      await reload();
      return { success: true };
    } catch (err) {
      // Rollback on error
      if (previousData) {
        setState(prev => ({ ...prev, data: previousData, error: String(err), validationErrors: null }));
      } else {
        setState(prev => ({ ...prev, error: String(err), validationErrors: null }));
      }
      return { success: false, error: String(err) };
    }
  }, [reload, state.data]);

  const clearValidationErrors = useCallback(() => {
    setState(prev => ({ ...prev, validationErrors: null }));
  }, []);

  return { ...state, reload, update, remove, clearValidationErrors };
}
