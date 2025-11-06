"use client";
import type { Contact } from "@/app/api/contacts/data";

export default function ContactItem({
  contact, onEdit, onDelete,
}: { contact: Contact; onEdit: (c: Contact) => void; onDelete: (id: string) => void; }) {
  // Get initials from name
  const initials = contact.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Role badge colors
  const roleBadgeColors = {
    Client: "bg-blue-100 text-blue-700",
    Lead: "bg-green-100 text-green-700",
    Partner: "bg-purple-100 text-purple-700",
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-blue-200 bg-white p-4 transition-all hover:shadow-md hover:border-blue-400" role="listitem">
      <div className="flex items-center gap-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-800"
          aria-hidden="true"
        >
          {initials}
        </div>
        <div>
          <div className="font-semibold text-gray-900">{contact.name}</div>
          <div className="text-sm text-gray-600">{contact.email}</div>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${roleBadgeColors[contact.role]}`}
          role="status"
          aria-label={`Role: ${contact.role}`}
        >
          {contact.role}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="rounded-lg border border-blue-300 bg-white px-3 py-1.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => onEdit(contact)}
          aria-label={`Edit ${contact.name}`}
        >
          Edit
        </button>
        <button
          className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-50 hover:border-red-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          onClick={() => onDelete(contact.id)}
          aria-label={`Delete ${contact.name}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
