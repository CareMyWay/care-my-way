import { uploadData, getUrl, remove } from "aws-amplify/storage";
import { getCurrentUser } from "aws-amplify/auth";

export interface UploadResult {
    success: boolean;
    url?: string;
    key?: string;
    error?: string;
}

/**
 * Upload a profile photo to S3
 */
export async function uploadProfilePhoto(file: File): Promise<UploadResult> {
    try {
        const user = await getCurrentUser();
        const fileKey = `profile-photos/${user.userId}/avatar-${Date.now()}-${file.name}`;

        await uploadData({
            key: fileKey,
            data: file,
            options: {
                contentType: file.type,
                metadata: {
                    userId: user.userId,
                    uploadedAt: new Date().toISOString(),
                }
            }
        }).result;

        // Get the public URL for the uploaded file
        const urlResult = await getUrl({
            key: fileKey,
            options: {
                expiresIn: 3600 // 1 hour expiry for initial access
            }
        });

        return {
            success: true,
            url: urlResult.url.toString(),
            key: fileKey
        };
    } catch (error) {
        console.error("Error uploading profile photo:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed"
        };
    }
}

/**
 * Upload a credentials document to S3
 */
export async function uploadCredentialsDocument(file: File, category: string): Promise<UploadResult> {
    try {
        const user = await getCurrentUser();
        const fileKey = `credentials/${user.userId}/${category}/${Date.now()}-${file.name}`;

        await uploadData({
            key: fileKey,
            data: file,
            options: {
                contentType: file.type,
                metadata: {
                    userId: user.userId,
                    category: category,
                    uploadedAt: new Date().toISOString(),
                }
            }
        }).result;

        // Get a private URL for the uploaded file
        const urlResult = await getUrl({
            key: fileKey,
            options: {
                expiresIn: 3600 // 1 hour expiry
            }
        });

        return {
            success: true,
            url: urlResult.url.toString(),
            key: fileKey
        };
    } catch (error) {
        console.error("Error uploading credentials document:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Upload failed"
        };
    }
}

/**
 * Upload multiple files
 */
export async function uploadMultipleFiles(
    files: File[],
    category: string
): Promise<{ successful: UploadResult[]; failed: UploadResult[] }> {
    const uploadPromises = files.map(file => uploadCredentialsDocument(file, category));
    const results = await Promise.all(uploadPromises);

    return {
        successful: results.filter(result => result.success),
        failed: results.filter(result => !result.success)
    };
}

/**
 * Delete a file from S3
 */
export async function deleteFile(key: string): Promise<boolean> {
    try {
        await remove({ key });
        return true;
    } catch (error) {
        console.error("Error deleting file:", error);
        return false;
    }
}

/**
 * Get a signed URL for a file
 */
export async function getFileUrl(key: string, expiresIn: number = 3600): Promise<string | null> {
    try {
        const result = await getUrl({
            key,
            options: { expiresIn }
        });
        return result.url.toString();
    } catch (error) {
        console.error("Error getting file URL:", error);
        return null;
    }
}

/**
 * Extract S3 key from full URL (for cleanup operations)
 */
export function extractS3Key(url: string): string | null {
    try {
        // Parse URLs like: https://amplify-storage-bucket.s3.region.amazonaws.com/profile-photos/userId/filename
        // or signed URLs
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split("/").filter(part => part.length > 0);

        // If it's a signed URL, the key might be in the path differently
        if (pathParts.length >= 2) {
            return pathParts.slice(1).join("/"); // Remove the first part which is usually empty or bucket info
        }

        return null;
    } catch (error) {
        console.error("Error extracting S3 key:", error);
        return null;
    }
}