import { 
    uploadBytes, 
    ref, 
    getDownloadURL,
} from 'firebase/storage'
import { storage } from 'firebase'

/**
 * Uploads an image to storage.
 * Supported file types are PNG and JPEG
 * @param {File} file 
 * @returns download url of the uploaded file, null if file is invalid
 */
export async function uploadImage(file) {
    if (!file || (file.type !== "image/png" && file.type !== "image/jpeg"))
        return null;
    
    const imageRef = ref(storage, file.name);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    return url;
}