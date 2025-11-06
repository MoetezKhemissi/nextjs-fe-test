"use client";
import type { Contact } from "@/app/api/contacts/data";

export default function ContactItem({
  contact, onEdit, onDelete,
}: { contact: Contact; onEdit: (c: Contact) => void; onDelete: (id: string) => void; }) {
  // TODO: render avatar initials, name, email, role badge
  // TODO: Edit (opens modal), Delete (calls onDelete)
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
      <div>TODO: contact info</div>
      <div className="flex items-center gap-2">
        <button className="rounded-lg border px-2 py-1 text-sm" onClick={() => onEdit(contact)}>Edit</button>
        <button className="rounded-lg border px-2 py-1 text-sm text-red-600" onClick={() => onDelete(contact.id)}>Delete</button>
      </div>
    </div>
  );
}
