"use client";

import React, { useState } from "react";
import { Upload, Download, ExternalLink, X, Loader2 } from "lucide-react";
import { uploadCredentialsDocument, deleteFile, getFileUrl } from "@/utils/s3-upload";
import { getCurrentUser } from "aws-amplify/auth";
import toast from "react-hot-toast";

interface DocumentUploadSectionProps {
    /** Current document S3 keys */
    documents: string[];
    /** Title for the upload section */
    title: string;
    /** Document category for S3 path (e.g., 'education', 'certification', 'work-experience') */
    category: string;
    /** Callback when documents are uploaded */
    // eslint-disable-next-line no-unused-vars
    onDocumentsUploaded?: (newS3Keys: string[]) => void;
    /** Callback when a document is removed */
    // eslint-disable-next-line no-unused-vars
    onDocumentRemoved?: (s3Key: string) => void;
    /** Unique ID for the file input */
    uploadId: string;
    /** Maximum file size in MB (default: 10) */
    maxSizeMB?: number;
    /** Whether uploads are disabled */
    disabled?: boolean;
    /** Custom accept file types */
    acceptedTypes?: string;
}

interface DocumentInfo {
    key: string;
    url: string;
    name: string;
    fileType: string;
}

export function DocumentUploadSection({
    documents,
    title,
    category,
    onDocumentsUploaded,
    onDocumentRemoved,
    uploadId,
    maxSizeMB = 10,
    disabled = false,
    acceptedTypes = ".pdf,.png,.jpg,.jpeg,.gif,.webp,.bmp,.svg"
}: DocumentUploadSectionProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [documentUrls, setDocumentUrls] = useState<DocumentInfo[]>([]);
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);

    // Helper functions
    const extractFileNameFromS3Key = (s3Key: string): string => {
        const parts = s3Key.split('/');
        const fullFileName = parts[parts.length - 1];
        // Remove timestamp prefix (format: timestamp-filename)
        const match = fullFileName.match(/^\d+-(.+)$/);
        return match ? match[1] : fullFileName;
    };

    const getFileType = (fileName: string): string => {
        const extension = fileName.split('.').pop()?.toLowerCase() || '';
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) return 'image';
        if (['pdf'].includes(extension)) return 'pdf';
        return 'document';
    };

    // Load document URLs when documents change
    React.useEffect(() => {
        const loadDocumentUrls = async () => {
            if (!documents || documents.length === 0) {
                setDocumentUrls([]);
                return;
            }

            setIsLoadingDocuments(true);
            try {
                const urlPromises = documents.map(async (s3Key) => {
                    const url = await getFileUrl(s3Key, 3600);
                    const name = extractFileNameFromS3Key(s3Key);
                    const fileType = getFileType(name);
                    return { key: s3Key, url: url || '', name, fileType };
                });

                const results = await Promise.all(urlPromises);
                setDocumentUrls(results.filter(result => result.url));
            } catch (error) {
                console.error('Error loading document URLs:', error);
            } finally {
                setIsLoadingDocuments(false);
            }
        };

        loadDocumentUrls();
    }, [documents]);

    // Handle file upload
    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);

        try {
            const user = await getCurrentUser();
            if (!user?.userId) {
                toast.error('User not found');
                return;
            }

            const uploadPromises = Array.from(files).map(async (file) => {
                // Validate file
                if (file.size > maxSizeMB * 1024 * 1024) {
                    toast.error(`File ${file.name} is too large (max ${maxSizeMB}MB)`);
                    return null;
                }

                const result = await uploadCredentialsDocument(file, category);
                return result.success ? result.key : null;
            });

            const uploadResults = await Promise.all(uploadPromises);
            const successfulUploads = uploadResults.filter(key => key !== null) as string[];

            if (successfulUploads.length > 0) {
                // Update document URLs for immediate display
                const newDocumentUrls = await Promise.all(
                    successfulUploads.map(async (s3Key) => {
                        const url = await getFileUrl(s3Key, 3600);
                        const name = extractFileNameFromS3Key(s3Key);
                        const fileType = getFileType(name);
                        return { key: s3Key, url: url || '', name, fileType };
                    })
                );

                setDocumentUrls(prev => [...prev, ...newDocumentUrls.filter(doc => doc.url)]);

                // Call callback with new S3 keys
                onDocumentsUploaded?.(successfulUploads);

                toast.success(`${successfulUploads.length} document(s) uploaded successfully!`);
            }
        } catch (error) {
            console.error('Error uploading documents:', error);
            toast.error('Failed to upload documents. Please try again.');
        } finally {
            setIsUploading(false);
            // Reset file input
            event.target.value = '';
        }
    };

    // Handle file removal
    const handleFileRemove = async (s3Key: string) => {
        try {
            // Delete from S3
            await deleteFile(s3Key);
            console.log('✅ File deleted from S3:', s3Key);

            // Update local state
            setDocumentUrls(prev => prev.filter(doc => doc.key !== s3Key));

            // Call callback
            onDocumentRemoved?.(s3Key);

            toast.success('Document removed successfully!');
        } catch (error) {
            console.error('Error removing file:', error);
            toast.error('Failed to remove document. Please try again.');
        }
    };

    return (
        <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700">{title}</label>

            {/* Upload Area */}
            <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-500 transition-colors">
                <input
                    id={uploadId}
                    type="file"
                    multiple
                    accept={acceptedTypes}
                    className="hidden"
                    onChange={handleFileUpload}
                    disabled={isUploading || disabled}
                />
                <label htmlFor={uploadId} className={`cursor-pointer ${(isUploading || disabled) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {isUploading ? (
                        <Loader2 className="mx-auto h-8 w-8 text-indigo-500 mb-2 animate-spin" />
                    ) : (
                        <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    )}
                    <span className="text-sm font-medium text-gray-700">
                        {isUploading ? 'Uploading...' : 'Upload Documents'}
                    </span>
                    <span className="block text-xs text-gray-500 mt-1">
                        PDF, PNG, JPG, GIF, WebP up to {maxSizeMB}MB each
                    </span>
                </label>
            </div>

            {/* Existing Documents Display */}
            {(documentUrls.length > 0 || isLoadingDocuments) && (
                <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-600">
                        {isLoadingDocuments ? 'Loading documents...' : `Uploaded Documents (${documentUrls.length})`}
                    </p>

                    {isLoadingDocuments ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600 p-3">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-gray-600"></div>
                            <span>Loading...</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {documentUrls.map((doc, docIndex) => (
                                <div key={doc.key} className="group bg-white border border-gray-200 rounded-lg p-3 hover:border-gray-300 transition-colors">
                                    <div className="flex items-start gap-3">
                                        {/* File preview/icon */}
                                        <div className="flex-shrink-0">
                                            {doc.fileType === 'image' ? (
                                                <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
                                                    <img
                                                        src={doc.url}
                                                        alt={doc.name}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.style.display = 'none';
                                                            const parent = target.parentElement;
                                                            if (parent) {
                                                                parent.innerHTML = `
                                                                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                                                                        <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clip-rule="evenodd" />
                                                                        </svg>
                                                                    </div>
                                                                `;
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            ) : doc.fileType === 'pdf' ? (
                                                <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                                                    <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-200">
                                                    <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                            )}
                                        </div>

                                        {/* File info */}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{doc.name}</p>
                                            <p className="text-xs text-gray-500 capitalize">{doc.fileType} document</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                type="button"
                                                onClick={() => window.open(doc.url, '_blank')}
                                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="View document"
                                            >
                                                <ExternalLink className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const link = document.createElement('a');
                                                    link.href = doc.url;
                                                    link.download = doc.name;
                                                    link.click();
                                                }}
                                                className="p-1.5 text-green-600 hover:bg-green-50 rounded-md transition-colors"
                                                title="Download document"
                                            >
                                                <Download className="w-4 h-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleFileRemove(doc.key)}
                                                className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Remove document"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}