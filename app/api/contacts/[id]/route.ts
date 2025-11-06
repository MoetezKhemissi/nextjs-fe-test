import { NextResponse } from "next/server";
import { store, type Contact } from "../data";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const patch = await req.json() as Partial<Contact>;
  const i = store.findIndex(c => c.id === id);
  if (i < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  store[i] = { ...store[i], ...patch };
  return NextResponse.json({ data: store[i] });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const i = store.findIndex(c => c.id === id);
  if (i < 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const [deleted] = store.splice(i, 1);
  return NextResponse.json({ data: deleted });
}
