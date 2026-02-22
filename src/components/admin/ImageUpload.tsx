import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";
import { ImageCropper } from "@/components/ui/image-cropper";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
  accept?: string;
  allowNonImage?: boolean;
}

export function ImageUpload({ currentImageUrl, onImageUploaded, label = "Image", accept = "image/*", allowNonImage = false }: ImageUploadProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl || "");
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');

    // Validate file type
    if (!isImage && !allowNonImage) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB limit for non-images, 5MB for images)
    const maxSize = allowNonImage ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Please upload a file smaller than ${allowNonImage ? '10' : '5'}MB`,
        variant: "destructive",
      });
      return;
    }

    // For non-image files, upload directly without cropping
    if (!isImage) {
      await uploadFileDirect(file);
      return;
    }

    // Store file for potential cropping choice
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadOriginal = async () => {
    if (!originalFile) return;
    setImageToCrop(null);
    await uploadFileDirect(originalFile);
    setOriginalFile(null);
  };

  const uploadFileDirect = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(fileName);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    if (!originalFile) return;

    setUploading(true);
    setImageToCrop(null);
    try {
      const fileExt = originalFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-images')
        .upload(filePath, croppedBlob);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio-images')
        .getPublicUrl(filePath);

      setPreview(publicUrl);
      onImageUploaded(publicUrl);

      toast({
        title: "Success",
        description: "Image uploaded and cropped successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setOriginalFile(null);
    }
  };

  const handleRemove = () => {
    setPreview("");
    onImageUploaded("");
  };

  const isPreviewImage = preview && (preview.match(/\.(jpg|jpeg|png|gif|webp|svg)(\?|$)/i) || preview.startsWith('data:image'));

  return (
    <>
      <div className="space-y-2">
        <Label>{label}</Label>
        {preview ? (
          <div className="relative inline-block">
            {isPreviewImage ? (
              <img src={preview} alt="Preview" className="max-w-xs max-h-48 rounded-lg border" />
            ) : (
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/50 max-w-xs">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground truncate">{preview.split('/').pop()?.split('?')[0]}</span>
              </div>
            )}
            <Button
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept={accept}
              onChange={handleFileUpload}
              disabled={uploading}
              className="max-w-xs"
            />
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>
        )}
      </div>
      
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          onCropComplete={handleCropComplete}
          onClose={() => {
            setImageToCrop(null);
            setOriginalFile(null);
          }}
          onUploadOriginal={handleUploadOriginal}
        />
      )}
    </>
  );
}
