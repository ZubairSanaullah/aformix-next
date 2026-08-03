import { Category } from "@prisma/client";

interface CategoriesTableProps {
    categories: Category[];
}

export default function CategoriesTable({
    categories,
}: CategoriesTableProps) {
    return (
        <div className="rounded-2xl border bg-card">
            <table className="w-full">
                <thead>
                    <tr className="border-b">
                        <th className="px-6 py-4 text-left font-medium">
                            Name
                        </th>

                        <th className="px-6 py-4 text-left font-medium">
                            Slug
                        </th>

                        <th className="px-6 py-4 text-left font-medium">
                            Posts
                        </th>

                        <th className="px-6 py-4 text-right font-medium">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {categories.length === 0 ? (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-6 py-10 text-center text-muted-foreground"
                            >
                                No categories found.
                            </td>
                        </tr>
                    ) : (
                        categories.map((category) => (
                            <tr key={category.id} className="border-b last:border-0">
                                <td className="px-6 py-4 font-medium">
                                    {category.name}
                                </td>

                                <td className="px-6 py-4 text-muted-foreground">
                                    {category.slug}
                                </td>

                                <td className="px-6 py-4">
                                    —
                                </td>

                                <td className="px-6 py-4 text-right">
                                    Actions
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}