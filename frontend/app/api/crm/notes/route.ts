import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/auth";
import { noteSchema } from "@/lib/validations/note";
import { createNote, getNotes } from "@/lib/services/note";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);

    const notes = await getNotes({
      search: searchParams.get("search") || undefined,
      companyId: searchParams.get("companyId") || undefined,
      contactId: searchParams.get("contactId") || undefined,
      leadId: searchParams.get("leadId") || undefined,
      dealId: searchParams.get("dealId") || undefined,
      userId: searchParams.get("ownerId") || session.user.id,
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("GET /api/crm/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = noteSchema.safeParse({
      ...body,
      userId: session.user.id,
    });

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const note = await createNote(parsed.data);
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("POST /api/crm/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}