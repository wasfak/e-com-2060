import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";

function UploadPic({ onImageUpload, imageUrls, onRemove, disabled }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleImageUpload = (result) => {
    if (result.event === "success") {
      const uploadedImageUrl = result.info.secure_url;
      onImageUpload(uploadedImageUrl);
    }
  };

  if (!isMounted) return null; // Ensure the component is mounted before rendering

  return (
    <div>
      <div className="flex gap-4 flex-wrap">
        {imageUrls.map((url, index) => (
          <div key={index} className="relative">
            <Image
              className="object-cover"
              alt={`Image ${index + 1}`}
              src={url}
              width={100}
              height={100}
            />
            <Button
              type="button"
              onClick={() => onRemove(url)}
              variant="destructive"
              size="icon"
              className="absolute top-0 right-0"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
      <CldUploadWidget
        uploadPreset="avhlxw7g"
        onUpload={handleImageUpload}
        multiple={true}
        options={{ multiple: true }}
      >
        {({ open }) => (
          <Button
            type="button"
            disabled={disabled}
            onClick={() => {
              if (open) {
                open();
              } else {
                console.error(
                  "The Cloudinary widget did not initialize correctly."
                );
              }
            }}
            variant="secondary"
            className="mt-4"
          >
            Upload Images
          </Button>
        )}
      </CldUploadWidget>
    </div>
  );
}

export default UploadPic;
