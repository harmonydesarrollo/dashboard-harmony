    const maxSizeMB = 3; // Tamaño máximo en MB
    
    export const allowedFormats = (): any => {
        return ['image/jpeg', 'image/png'];
    }
    
    export const maxSizeBytes = (): any => {
        return maxSizeMB * 1024 * 1024;
    }