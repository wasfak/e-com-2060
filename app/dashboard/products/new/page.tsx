"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import LoadingButton from "@/components/LoadingButton";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { createProductAction } from "@/lib/actions/createProduct";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  price: z.number().min(1, {
    message: "Price must be at least 1.",
  }),
  stock: z.number().min(1, {
    message: "Stock must be at least 1.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  discount: z.boolean().optional(),
  archive: z.boolean(),
  discountType: z.enum(["percent", "fixed"]).optional(),
  discountValue: z.number().min(1).optional(),
  images: z.array(z.object({ url: z.string() })), // Use object array to store image URLs
});

export default function AddNewProduct() {
  const [imageUrls, setImageUrls] = useState<{ url: string }[]>([]);
  const { user } = useUser();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: 0,
      stock: 0,
      description: "",
      discount: false,
      archive: false,
      discountType: undefined,
      images: [],
    },
  });

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "avhlxw7g"); // Replace with your Cloudinary preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dmcz9mbis/image/upload", // Replace with your Cloudinary cloud name
        formData
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null; // Return null in case of an error to avoid breaking the flow
    }
  };

  const handleImageUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    const uploadedUrls = await Promise.all(
      Array.from(files).map(async (file) => {
        const url = await uploadImageToCloudinary(file);
        return url ? { url } : null;
      })
    );

    const validUrls = uploadedUrls.filter((urlObj) => urlObj !== null) as {
      url: string;
    }[];

    const updatedUrls = [...imageUrls, ...validUrls];
    setImageUrls(updatedUrls);
    form.setValue("images", updatedUrls); // Sync with form state
  };

  const handleImageRemove = (urlToRemove: string) => {
    const updatedUrls = imageUrls.filter((image) => image.url !== urlToRemove);
    setImageUrls(updatedUrls);
    form.setValue("images", updatedUrls); // Sync with form state
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const response = await createProductAction({
      ...values,
      discountType:
        values.discountType === "percent" || values.discountType === "fixed"
          ? values.discountType
          : undefined, // Ensure discountType is valid or undefined
    });
    console.log(response);
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-8"
        >
          <div className="space-y-4">
            <FormItem>
              <FormLabel>Upload Images</FormLabel>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageUpload(e.target.files!)}
                disabled={form.formState.isSubmitting}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
              />
              <FormMessage />
            </FormItem>
            <div className="flex flex-wrap gap-x-4 mt-4 border rounded-lg p-4">
              {imageUrls.map((image) => (
                <div key={image.url} className="relative ">
                  <Image
                    src={image.url}
                    alt="Uploaded image"
                    className="object-fit rounded-lg "
                    width={170}
                    height={170}
                  />
                  <Button
                    type="button"
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full"
                    onClick={() => handleImageRemove(image.url)}
                  >
                    &times;
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Other form fields */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Product Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    {...field}
                    onChange={(event) =>
                      field.onChange(parseFloat(event.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Stock"
                    {...field}
                    onChange={(event) =>
                      field.onChange(parseInt(event.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-center gap-x-4">
            <FormField
              control={form.control}
              name="discountType"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-y-4 rounded-lg border p-4">
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      if (value === "percent" || value === "fixed") {
                        form.setValue("discount", true);
                      } else {
                        form.setValue("discount", false);
                      }
                    }}
                    value={field.value}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        {field.value === undefined
                          ? "Select a Discount"
                          : field.value}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="percent">%</SelectItem>
                        <SelectItem value="fixed">Fixed</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {(field.value === "percent" || field.value === "fixed") && (
                    <Input
                      type="number"
                      placeholder="Enter discount value"
                      onChange={(event) => {
                        form.setValue(
                          "discountValue",
                          parseFloat(event.target.value)
                        );
                      }}
                    />
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="archive"
              render={({ field }) => (
                <FormItem className="flex items-center gap-x-4 justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Archive</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <LoadingButton
            type="submit"
            className="ml-4"
            loading={form.formState.isSubmitting}
          >
            Submit
          </LoadingButton>
        </form>
      </Form>
    </div>
  );
}
