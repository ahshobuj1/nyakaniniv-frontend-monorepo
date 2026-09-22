'use client';

import React, {useState, useRef, useEffect} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {Upload, Trash2} from 'lucide-react';
import {toast} from 'sonner';

import {Dialog, DialogContent, DialogHeader, DialogTitle} from '@repo/ui';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@repo/ui';
import {Input} from '@repo/ui';
import {Button} from '@repo/ui';
import { useCreateMixTapeMutation, useUpdateMixTapeMutation } from '@repo/store';

const mixtapeSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Title is required')
    .min(2, 'Title must be at least 2 characters'),
  audioUrl: z
    .string()
    .trim()
    .min(1, 'Audio URL is required')
    .refine((val) => {
      try {
        const url = new URL(val);
        return url.protocol === 'http:' || url.protocol === 'https:';
      } catch {
        return false;
      }
    }, 'Please enter a valid URL starting with http:// or https://'),
  order: z.coerce
    .number()
    .int('Order must be an integer')
    .min(0, 'Order must be 0 or greater')
    .optional()
    .or(z.literal('')),
});

type MixTapeFormValues = z.infer<typeof mixtapeSchema>;

interface CreateMixTapeProps {
  isOpen: boolean;
  onClose: () => void;
  mixtapeToEdit?: any;
}

export default function CreateMixTape({isOpen, onClose, mixtapeToEdit}: CreateMixTapeProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createMixTape, { isLoading: isCreating }] = useCreateMixTapeMutation();
  const [updateMixTape, { isLoading: isUpdating }] = useUpdateMixTapeMutation();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<MixTapeFormValues>({
    resolver: zodResolver(mixtapeSchema) as any,
    mode: 'onTouched',
    defaultValues: {
      title: '',
      audioUrl: '',
      order: '',
    },
  });

  useEffect(() => {
    if (mixtapeToEdit && isOpen) {
      form.reset({
        title: mixtapeToEdit.title || '',
        audioUrl: mixtapeToEdit.audioUrl || '',
        order: mixtapeToEdit.order !== null ? mixtapeToEdit.order : '',
      });
      setSelectedFile(null);
      setFileName('');
      setPreviewUrl(mixtapeToEdit.coverImage || null);
    } else if (isOpen) {
      form.reset({
        title: '',
        audioUrl: '',
        order: '',
      });
      setSelectedFile(null);
      setFileName('');
      setPreviewUrl(null);
    }
  }, [mixtapeToEdit, isOpen, form]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Only image files (JPEG, PNG, WebP) are allowed.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('Cover image size must be less than 5MB.');
        return;
      }

      setSelectedFile(file);
      setFileName(file.name);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setFileName('');
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: MixTapeFormValues) => {
    try {
      if (mixtapeToEdit) {
        await updateMixTape({
          id: mixtapeToEdit.id,
          title: data.title,
          audioUrl: data.audioUrl,
          order: data.order !== '' ? Number(data.order) : undefined,
          coverImage: selectedFile || undefined,
        }).unwrap();
        toast.success('MixTape updated successfully!');
      } else {
        await createMixTape({
          title: data.title,
          audioUrl: data.audioUrl as string,
          order: data.order !== '' ? Number(data.order) : undefined,
          coverImage: selectedFile || undefined,
        }).unwrap();
        toast.success('MixTape created successfully!');
      }
      onClose();
    } catch (error: any) {
      toast.error(error?.data?.error?.message || error?.data?.message || 'Failed to save mixtape');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 bg-white border-0 shadow-2xl rounded-[20px] overflow-hidden">
        <DialogHeader className="px-8 pt-8 pb-4">
          <DialogTitle className="text-[24px] font-bold text-[#111620]">
            {mixtapeToEdit ? 'Edit MixTape' : 'Add New MixTape'}
          </DialogTitle>
        </DialogHeader>

        <Form {...(form as any)}>
          <form onSubmit={form.handleSubmit(onSubmit as any)} className="px-8 pb-8 space-y-6">
            
            {/* File Upload / Preview Area */}
            <div className="space-y-2">
              <FormLabel className="text-[13px] font-semibold text-[#111620] uppercase tracking-wide">
                Cover Image
              </FormLabel>

              {previewUrl ? (
                <div className="relative w-full h-44 rounded-xl overflow-hidden border border-gray-200 group bg-gray-100 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Cover preview"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-gray-800 text-xs font-semibold rounded-lg shadow-md hover:bg-gray-100 transition-colors cursor-pointer">
                      <Upload className="w-3.5 h-3.5" />
                      Change Image
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-36 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-white shadow-xs flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                    <Upload className="w-5 h-5 text-gray-500" />
                  </div>
                  <p className="text-sm font-medium text-gray-700">Click to upload cover image</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP up to 5MB</p>
                </div>
              )}

              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <FormField
              control={form.control as any}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold text-[#111620] uppercase tracking-wide">
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Summer Vibes 2026"
                      className={`h-12 rounded-xl bg-white px-4 text-[15px] placeholder:text-gray-400 transition-colors ${
                        form.formState.errors.title
                          ? 'border-red-500 focus-visible:ring-red-200 focus-visible:border-red-500'
                          : 'border-gray-200 focus-visible:ring-primary focus-visible:border-primary'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="audioUrl"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold text-[#111620] uppercase tracking-wide">
                    Audio URL <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://soundcloud.com/..."
                      className={`h-12 rounded-xl bg-white px-4 text-[15px] placeholder:text-gray-400 transition-colors ${
                        form.formState.errors.audioUrl
                          ? 'border-red-500 focus-visible:ring-red-200 focus-visible:border-red-500'
                          : 'border-gray-200 focus-visible:ring-primary focus-visible:border-primary'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium mt-1" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="order"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold text-[#111620] uppercase tracking-wide">
                    Display Order
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="e.g. 1"
                      className={`h-12 rounded-xl bg-white px-4 text-[15px] placeholder:text-gray-400 transition-colors ${
                        form.formState.errors.order
                          ? 'border-red-500 focus-visible:ring-red-200 focus-visible:border-red-500'
                          : 'border-gray-200 focus-visible:ring-primary focus-visible:border-primary'
                      }`}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 font-medium mt-1" />
                </FormItem>
              )}
            />

            <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="h-12 px-6 rounded-xl font-semibold border-gray-200 hover:bg-gray-50"
                disabled={isSubmitting}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-8 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white shadow-sm">
                {isSubmitting ? 'Saving...' : 'Save MixTape'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
