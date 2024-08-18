"use client";

import { useEffect, useState } from "react";
import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { CldUploadWidget } from "next-cloudinary";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (urls: string[]) => void;
  onRemove: (url: string) => void;
  value: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  disabled,
  onChange,
  onRemove,
  value,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const onUpload = (result: any) => {
    if (result.info.secure_url) {
      // Add the new URL to the existing list of image URLs
      const updatedUrls = [...value, result.info.secure_url];
      console.log(updatedUrls);

      onChange(updatedUrls); // Pass the updated array to the parent component
    }
  };

  if (!isMounted) {
    return null;
  }

  return (
    <div className="mb-4 flex items-center gap-4">
      {value.map((url) => (
        <div
          key={url}
          className="relative size-[200px] overflow-hidden rounded-md"
        >
          <div className="absolute right-2 top-2 z-10">
            <button
              type="button"
              onClick={() => onRemove(url)}
              /*    variant="destructive" */
              /*      size="icon" */
            >
              <Trash className="size-4" />
            </button>
          </div>
          <Image
            className="object-cover"
            src={url}
            alt="Image"
            width={200}
            height={200}
          />
        </div>
      ))}
      <CldUploadWidget
        uploadPreset="avhlxw7g"
        onSuccess={onUpload}
        options={{
          sources: ["local", "url", "unsplash"],
          multiple: true,
          maxFiles: 5,
        }}
      >
        {({ open }) => {
          const onClick = () => {
            open();
          };

          return (
            <button
              type="button"
              disabled={disabled}
              /*      variant="secondary" */
              onClick={onClick}
            >
              <ImagePlus className="mr-2 size-4" />
              Upload an Image
            </button>
          );
        }}
      </CldUploadWidget>
    </div>
  );
};

export default ImageUpload;
