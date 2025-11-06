"use client";

import { useState } from "react";
import { useContacts } from "@/lib/hooks/useContacts";
import ContactItem from "@/components/ContactItem";
import Modal from "@/components/Modal";
import type { Contact } from "@/app/api/contacts/data";

export default function ContactsPage() {
  const { data, loading, error, update, remove } = useContacts();
  const [editing, setEditing] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "Lead" as Contact["role"] });
  const [query, setQuery] = useState("");

  // TODO: filter by query; open modal on edit; save -> update(); reflect changes

  return (
    <div className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Contacts</h1>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name or email…"
        className="mb-4 w-full rounded-lg border px-3 py-2"
      />

      {loading && <div className="text-gray-500">Loading…</div>}
      {error && <div className="text-red-600">Error: {error}</div>}

      <div className="space-y-3">
        {/* TODO: map over filtered data and render ContactItem */}
      </div>

      <Modal open={!!editing} onClose={() => setEditing(null)} title="Edit contact">
        {/* TODO: simple form (name/email/role) + Save */}
      </Modal>
    </div>
  );
}
