import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { noteSchema } from "@/lib/validations/note";
import { getNotes, createNote } from "@/lib/services/note";

export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);

    const notes = await getNotes({
      search: searchParams.get("search") || undefined,
      contactId: searchParams.get("contactId") || undefined,
      companyId: searchParams.get("companyId") || undefined,
      leadId: searchParams.get("leadId") || undefined,
      dealId: searchParams.get("dealId") || undefined,
      userId: searchParams.get("userId") || undefined,
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error("GET /api/crm/notes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = noteSchema
      .omit({ userId: true })
      .safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Re-run the "at least one relationship" refinement manually since
    // .omit() on a refined schema drops the .refine() wrapper.
    const hasRelationship =
      parsed.data.contactId ||
      parsed.data.companyId ||
      parsed.data.leadId ||
      parsed.data.dealId;

    if (!hasRelationship) {
      return NextResponse.json(
        {
          error:
            "A note must be linked to at least one of: contact, company, lead, or deal.",
        },
        { status: 400 }
      );
    }

    const note = await createNote({
      ...parsed.data,
      userId: session.user.id as string,
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/crm/notes error:", error);
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}