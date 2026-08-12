import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { noteUpdateSchema } from "@/lib/validations/note";
import { getNoteById, updateNote, deleteNote } from "@/lib/services/note";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const note = await getNoteById(id);

    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error("GET /api/crm/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await getNoteById(id);

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    const body = await req.json();
    const parsed = noteUpdateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const note = await updateNote(id, parsed.data);
    return NextResponse.json(note);
  } catch (error) {
    console.error("PATCH /api/crm/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const existing = await getNoteById(id);

    if (!existing) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }

    await deleteNote(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/crm/notes/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}