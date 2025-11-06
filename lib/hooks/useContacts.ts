"use client";
import { useEffect, useState, useCallback } from "react";
import type { Contact } from "@/app/api/contacts/data";

type State = { data: Contact[] | null; loading: boolean; error: string | null };

export function useContacts() {
  const [state, setState] = useState<State>({ data: null, loading: true, error: null });

  const reload = useCallback(async () => {
    // TODO: fetch /api/contacts and set {data, loading:false}
  }, []);

  useEffect(() => { reload(); }, [reload]);

  const update = useCallback(async (id: string, patch: Partial<Contact>) => {
    // TODO: optimistic edit or simple refetch after PUT /api/contacts/:id
  }, [reload]);

  const remove = useCallback(async (id: string) => {
    // TODO: optimistic delete or simple refetch after DELETE /api/contacts/:id
  }, [reload]);

  return { ...state, reload, update, remove };
}
