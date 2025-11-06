export type Contact = {
  id: string;
  name: string;
  email: string;
  role: "Client" | "Lead" | "Partner";
};

// one global in-memory store so both routes share state during dev
const globalKey = "__CONTACTS_STORE__";
const g = globalThis as any;

if (!g[globalKey]) {
  g[globalKey] = [
    { id: "1", name: "Alice Martin", email: "alice@example.com", role: "Client" },
    { id: "2", name: "Benoit Dupont", email: "benoit@example.com", role: "Lead" },
    { id: "3", name: "Chloé Fabre", email: "chloe@example.com", role: "Partner" }
  ] as Contact[];
}

export const store = g[globalKey] as Contact[];
