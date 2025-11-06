import { NextResponse } from "next/server";
import { store, type Contact } from "./data";

export async function GET() {
  return NextResponse.json({ data: store });
}

export async function POST(req: Request) {
  const body = await req.json();
  const newItem: Contact = {
    id: crypto.randomUUID(),
    name: body.name ?? "",
    email: body.email ?? "",
    role: body.role ?? "Lead",
  };
  store.unshift(newItem);
  return NextResponse.json({ data: newItem }, { status: 201 });
}
