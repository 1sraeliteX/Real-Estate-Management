import { validateFile } from './validation'

export interface UploadResult {
  success: boolean
  url?: string
  error?: string
}

export class FileUploadHandler {
  private static readonly UPLOAD_ENDPOINT = '/api/upload'
  
  static async uploadFile(file: File): Promise<UploadResult> {
    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      return { success: false, error: validation.errors.join(', ') }
    }
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch(this.UPLOAD_ENDPOINT, {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }
      
      const result = await response.json()
      return { success: true, url: result.url }
      
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      }
    }
  }
  
  static async uploadMultipleFiles(files: File[]): Promise<UploadResult[]> {
    const uploadPromises = files.map(file => this.uploadFile(file))
    return Promise.all(uploadPromises)
  }
  
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file)
  }
  
  static revokePreviewUrl(url: string): void {
    URL.revokeObjectURL(url)
  }
  
  static async compressImage(file: File, maxWidth: number = 1200, quality: number = 0.8): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')!
      const img = new Image()
      
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height)
        canvas.width = img.width * ratio
        canvas.height = img.height * ratio
        
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
        
        canvas.toBlob((blob) => {
          if (blob) {
            const compressedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
            resolve(compressedFile)
          } else {
            resolve(file)
          }
        }, file.type, quality)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }
}