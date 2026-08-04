import { Prisma } from "@prisma/client";

import EmptyState from "@/components/ui/EmptyState";
import TagActions from "./TagActions";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

type TagWithCount = Prisma.TagGetPayload<{
    include: {
        _count: {
            select: {
                posts: true;
            };
        };
    };
}>;

interface TagsTableProps {
    tags: TagWithCount[];
}

export default function TagsTable({
    tags,
}: TagsTableProps) {
    if (tags.length === 0) {
        return (
            <EmptyState
                title="No tags found"
                description="Create your first tag to organize your blog posts."
            />
        );
    }

    return (
        <div className="rounded-xl border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Slug</TableHead>
                        <TableHead>Posts</TableHead>
                        <TableHead className="text-right">
                            Actions
                        </TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {tags.map((tag) => (
                        <TableRow key={tag.id}>
                            <TableCell className="font-medium">
                                {tag.name}
                            </TableCell>

                            <TableCell className="text-muted-foreground">
                                {tag.slug}
                            </TableCell>

                            <TableCell>
                                {tag._count.posts}
                            </TableCell>

                            <TableCell className="text-right">
                                <TagActions tag={tag} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}