"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, Loader, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ImportPreviewRow {
    rowNumber: number;
    data: Record<string, any>;
    valid: boolean;
    error?: string;
}

interface FinanceImportUploaderProps {}

export default function FinanceImportUploader({}: FinanceImportUploaderProps) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<ImportPreviewRow[]>([]);
    const [showPreview, setShowPreview] = useState(false);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        const validTypes = [
            "text/csv",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        ];

        if (!validTypes.includes(selectedFile.type)) {
            toast.error(
                "Invalid file type. Please upload a CSV or Excel file."
            );
            return;
        }

        // Validate file size (max 10MB)
        if (selectedFile.size > 10 * 1024 * 1024) {
            toast.error("File is too large. Maximum size is 10MB.");
            return;
        }

        setFile(selectedFile);
        setPreview([]);
        setShowPreview(false);
    };

    const handlePreview = async () => {
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("action", "preview");

            const response = await fetch("/api/finance/imports/preview", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to preview file");
            }

            const result = await response.json();
            setPreview(result.rows || []);
            setShowPreview(true);

            toast.success(
                `Preview ready: ${result.rows.length} rows (${result.validRows} valid)`
            );
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to preview file"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleConfirmImport = async () => {
        if (!file) return;

        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("action", "import");

            const response = await fetch("/api/finance/imports", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Failed to import file");
            }

            const result = await response.json();
            toast.success(
                `Import completed: ${result.successfulRows} of ${result.totalRows} rows imported`
            );

            router.push(`/workspace/finance/imports/${result.importId}`);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "An error occurred"
            );
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* File Upload */}
            {!showPreview ? (
                <div className="space-y-4">
                    <div
                        className="
              relative
              rounded-lg
              border-2
              border-dashed
              border-[var(--workspace-border)]
              bg-[var(--workspace-card-background)]
              p-8
              text-center
              transition-colors
              hover:border-[var(--workspace-primary)]
              hover:bg-[var(--workspace-card-background)]/50
            "
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.xlsx,.xls"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        <div className="space-y-2">
                            <Upload className="mx-auto h-8 w-8 text-[var(--workspace-text-muted)]" />
                            <p className="text-sm font-medium text-[var(--workspace-text)]">
                                {file ? file.name : "Click to upload or drag and drop"}
                            </p>
                            <p className="text-xs text-[var(--workspace-text-muted)]">
                                CSV or Excel (max 10MB)
                            </p>
                        </div>
                    </div>

                    {file && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setFile(null);
                                    setPreview([]);
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                                disabled={uploading}
                                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  border
                  border-[var(--workspace-border)]
                  bg-[var(--workspace-background)]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-[var(--workspace-text)]
                  transition-colors
                  hover:bg-[var(--workspace-card-background)]
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                "
                            >
                                Clear
                            </button>

                            <button
                                onClick={handlePreview}
                                disabled={uploading || !file}
                                className="
                  flex-1
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-lg
                  bg-[var(--workspace-primary)]
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-white
                  shadow-sm
                  transition-all
                  duration-150
                  hover:opacity-90
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  focus:outline-none
                  focus:ring-2
                  focus:ring-[var(--workspace-primary)]
                  focus:ring-offset-2
                  focus:ring-offset-[var(--workspace-background)]
                "
                            >
                                {uploading ? (
                                    <>
                                        <Loader className="h-4 w-4 animate-spin" />
                                        Previewing...
                                    </>
                                ) : (
                                    "Preview File"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                /* Preview Display */
                <div className="space-y-4">
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-[var(--workspace-text)]">
                            Preview
                        </h3>
                        <p className="text-xs text-[var(--workspace-text-muted)]">
                            Showing first {Math.min(preview.length, 10)} rows
                        </p>
                    </div>

                    {/* Row Stats */}
                    <div className="grid gap-3 sm:grid-cols-4">
                        {[
                            {
                                label: "Valid Rows",
                                value: preview.filter((r) => r.valid).length,
                                color: "emerald",
                            },
                            {
                                label: "Invalid Rows",
                                value: preview.filter((r) => !r.valid).length,
                                color: "red",
                            },
                            {
                                label: "Total Rows",
                                value: preview.length,
                                color: "blue",
                            },
                        ].map((stat) => (
                            <div
                                key={stat.label}
                                className="rounded-lg border border-[var(--workspace-border)] bg-[var(--workspace-card-background)] p-3"
                            >
                                <p className="text-xs font-medium text-[var(--workspace-text-muted)]">
                                    {stat.label}
                                </p>
                                <p
                                    className={`text-lg font-semibold mt-1 text-${stat.color}-600 dark:text-${stat.color}-400`}
                                >
                                    {stat.value}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Preview Table */}
                    <div className="overflow-x-auto rounded-lg border border-[var(--workspace-border)]">
                        <table className="w-full text-xs">
                            <thead className="bg-[var(--workspace-card-background)]">
                                <tr>
                                    <th className="py-2 px-3 text-left font-medium text-[var(--workspace-text)]">
                                        Row
                                    </th>
                                    <th className="py-2 px-3 text-left font-medium text-[var(--workspace-text)]">
                                        Status
                                    </th>
                                    <th className="py-2 px-3 text-left font-medium text-[var(--workspace-text)]">
                                        Data Preview
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {preview.slice(0, 10).map((row) => (
                                    <tr
                                        key={row.rowNumber}
                                        className="border-t border-[var(--workspace-border)]"
                                    >
                                        <td className="py-2 px-3 text-[var(--workspace-text-muted)]">
                                            {row.rowNumber}
                                        </td>
                                        <td className="py-2 px-3">
                                            {row.valid ? (
                                                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                                    <CheckCircle className="h-3 w-3" />
                                                    Valid
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400">
                                                    <AlertCircle className="h-3 w-3" />
                                                    Invalid
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-2 px-3 text-[var(--workspace-text-muted)]">
                                            {row.error ? (
                                                <span className="text-red-600 dark:text-red-400">
                                                    {row.error}
                                                </span>
                                            ) : (
                                                <span className="text-xs font-mono">
                                                    {Object.entries(row.data)
                                                        .slice(0, 3)
                                                        .map(
                                                            ([k, v]) =>
                                                                `${k}: ${v}`
                                                        )
                                                        .join(" • ")}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setShowPreview(false);
                                setFile(null);
                            }}
                            disabled={uploading}
                            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              border
              border-[var(--workspace-border)]
              bg-[var(--workspace-background)]
              px-4
              py-2
              text-sm
              font-medium
              text-[var(--workspace-text)]
              transition-colors
              hover:bg-[var(--workspace-card-background)]
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
                        >
                            Back
                        </button>

                        <button
                            onClick={handleConfirmImport}
                            disabled={
                                uploading ||
                                preview.filter((r) => r.valid).length === 0
                            }
                            className="
              flex-1
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[var(--workspace-primary)]
              px-4
              py-2
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-150
              hover:opacity-90
              disabled:opacity-50
              disabled:cursor-not-allowed
              focus:outline-none
              focus:ring-2
              focus:ring-[var(--workspace-primary)]
              focus:ring-offset-2
              focus:ring-offset-[var(--workspace-background)]
            "
                        >
                            {uploading ? (
                                <>
                                    <Loader className="h-4 w-4 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                `Import ${preview.filter((r) => r.valid).length} Valid Rows`
                            )}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
