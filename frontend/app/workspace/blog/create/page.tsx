import { prisma } from '@/lib/prisma';
import CreatePostClient from '@/components/workspace/blog/CreatePostClient';

export default async function CreatePostPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  });

  return <CreatePostClient categories={categories} tags={tags} />;
}