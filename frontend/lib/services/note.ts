import { prisma } from "@/lib/prisma";
import type {
  NoteInput,
  NoteUpdateInput,
} from "@/lib/validations/note";

interface GetNotesParams {
  search?: string;
  contactId?: string;
  companyId?: string;
  leadId?: string;
  dealId?: string;
  userId?: string;
}

const noteInclude = {
  contact: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
    },
  },
  company: {
    select: {
      id: true,
      name: true,
    },
  },
  lead: {
    select: {
      id: true,
      title: true,
    },
  },
  deal: {
    select: {
      id: true,
      title: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} as const;

export async function getNotes(params: GetNotesParams = {}) {
  const { search, contactId, companyId, leadId, dealId, userId } = params;

  return prisma.note.findMany({
    where: {
      ...(search && {
        content: { contains: search, mode: "insensitive" },
      }),
      ...(contactId && { contactId }),
      ...(companyId && { companyId }),
      ...(leadId && { leadId }),
      ...(dealId && { dealId }),
      ...(userId && { userId }),
    },
    include: noteInclude,
    orderBy: { createdAt: "desc" },
  });
}

export async function getNoteById(id: string) {
  return prisma.note.findUnique({
    where: { id },
    include: noteInclude,
  });
}

export async function createNote(data: NoteInput) {
  return prisma.note.create({
    data: {
      content: data.content,
      contactId: data.contactId ?? undefined,
      companyId: data.companyId ?? undefined,
      leadId: data.leadId ?? undefined,
      dealId: data.dealId ?? undefined,
      userId: data.userId,
    },
    include: noteInclude,
  });
}

export async function updateNote(id: string, data: NoteUpdateInput) {
  return prisma.note.update({
    where: { id },
    data: {
      ...(data.content !== undefined && { content: data.content }),
      ...(data.contactId !== undefined && { contactId: data.contactId }),
      ...(data.companyId !== undefined && { companyId: data.companyId }),
      ...(data.leadId !== undefined && { leadId: data.leadId }),
      ...(data.dealId !== undefined && { dealId: data.dealId }),
    },
    include: noteInclude,
  });
}

export async function deleteNote(id: string) {
  return prisma.note.delete({
    where: { id },
  });
}