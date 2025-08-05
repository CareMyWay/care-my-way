"use client";

import { useState, useEffect } from "react";
import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getFileUrl } from "@/utils/s3-upload";

interface DocumentAttachment {
    key: string;
    url: string;
    name: string;
    fileType: string;
}

interface DocumentAttachmentGridProps {
    /** Array of S3 keys for documents */
    documents: string[];
    /** Title for the document section */
    title: string;
    /** Grid columns configuration (default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5") */
    gridCols?: string;
    /** Whether to show action buttons (View, Download) */
    showActions?: boolean;
    /** Custom action buttons (receives document info) */
    customActions?: (doc: DocumentAttachment) => React.ReactNode;
    /** Loading state */
    isLoading?: boolean;
}

export function DocumentAttachmentGrid({
    documents,
    title,
    gridCols = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
    showActions = true,
    customActions,
    isLoading: externalLoading = false
}: DocumentAttachmentGridProps) {
    const [documentUrls, setDocumentUrls] = useState<DocumentAttachment[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Helper function to extract filename from S3 key
    const extractFileNameFromS3Key = (s3Key: string): string => {
        const parts = s3Key.split('/');
        const fullFileName = parts[parts.length - 1];
        // Remove timestamp prefix (format: timestamp-filename)
        const match = fullFileName.match(/^\d+-(.+)$/);
        return match ? match[1] : fullFileName;
    };

    // Helper function to determine file type
    const getFileType = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) return 'image';
        if (['pdf'].includes(extension)) return 'pdf';
        return 'document';
    };

    useEffect(() => {
        const loadDocumentUrls = async () => {
            if (!documents || documents.length === 0) {
                setDocumentUrls([]);
                return;
            }

            setIsLoading(true);
            try {
                const urlPromises = documents.map(async (s3Key) => {
                    const url = await getFileUrl(s3Key, 3600); // 1 hour expiry
                    const name = extractFileNameFromS3Key(s3Key);
                    const fileType = getFileType(name);
                    return { key: s3Key, url: url || '', name, fileType };
                });

                const results = await Promise.all(urlPromises);
                setDocumentUrls(results.filter(result => result.url)); // Only keep successful ones
            } catch (error) {
                console.error('Error loading document URLs:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadDocumentUrls();
    }, [documents]);

    if (!documents || documents.length === 0) return null;

    const loading = isLoading || externalLoading;

    return (
        <div className="mt-4 p-4 bg-white/70 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
                <FileText className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-700 text-sm">{title}</span>
                <Badge variant="secondary" className="text-xs">
                    {documents.length} file{documents.length !== 1 ? 's' : ''}
                </Badge>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                    <span>Loading documents...</span>
                </div>
            ) : (
                <div className={`grid ${gridCols} gap-4`}>
                    {documentUrls.map((doc, index) => (
                        <div key={index} className="group relative bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden">

                            {/* Action Icons - Top Right Corner */}
                            {(showActions || customActions) && (
                                <div className="absolute top-2 right-2 z-10 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {customActions ? (
                                        customActions(doc)
                                    ) : showActions ? (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:bg-white hover:shadow-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    window.open(doc.url, '_blank');
                                                }}
                                                title="View document"
                                            >
                                                <ExternalLink className="h-4 w-4 text-blue-600" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="secondary"
                                                className="h-8 w-8 p-0 bg-white/90 backdrop-blur-sm border-0 shadow-md hover:bg-white hover:shadow-lg"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    const link = document.createElement('a');
                                                    link.href = doc.url;
                                                    link.download = doc.name;
                                                    link.click();
                                                }}
                                                title="Download document"
                                            >
                                                <Download className="h-4 w-4 text-green-600" />
                                            </Button>
                                        </>
                                    ) : null}
                                </div>
                            )}

                            {/* Document Preview */}
                            <div className="cursor-pointer" onClick={() => window.open(doc.url, '_blank')}>
                                <div className="aspect-[4/3] w-full bg-gray-50 flex items-center justify-center overflow-hidden">
                                    {doc.fileType === 'image' ? (
                                        <img
                                            src={doc.url}
                                            alt={doc.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            onError={(e) => {
                                                // Fallback to file icon if image fails to load
                                                const target = e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                const parent = target.parentElement;
                                                if (parent) {
                                                    parent.innerHTML = `
                                                        <div class="w-full h-full flex items-center justify-center bg-gray-100">
                                                            <div class="text-center">
                                                                <svg class="w-12 h-12 text-gray-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                                                </svg>
                                                                <div class="text-xs text-gray-500">Image Preview</div>
                                                            </div>
                                                        </div>
                                                    `;
                                                }
                                            }}
                                        />
                                    ) : doc.fileType === 'pdf' ? (
                                        <div className="w-full h-full flex items-center justify-center bg-red-50">
                                            <div className="text-center">
                                                <svg className="w-16 h-16 text-red-600 mx-auto mb-3" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                </svg>
                                                <div className="text-red-600 font-bold text-lg">PDF</div>
                                                <div className="text-red-500 text-xs mt-1">Click to view</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-blue-50">
                                            <div className="text-center">
                                                <FileText className="w-16 h-16 text-blue-600 mx-auto mb-3" />
                                                <div className="text-blue-600 font-bold text-lg">DOC</div>
                                                <div className="text-blue-500 text-xs mt-1">Click to view</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* File Info */}
                            <div className="p-3 border-t border-gray-100">
                                <h4 className="font-medium text-gray-900 text-sm truncate mb-1">{doc.name}</h4>
                                <p className="text-xs text-gray-500 capitalize">{doc.fileType}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}