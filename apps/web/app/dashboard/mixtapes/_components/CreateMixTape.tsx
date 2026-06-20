'use client';

import React, {useState, useRef, useEffect} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {Upload} from 'lucide-react';
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
  title: z.string().min(2, 'Title is too short'),
  audioUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  order: z.coerce.number().optional().or(z.literal('')),
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createMixTape, { isLoading: isCreating }] = useCreateMixTapeMutation();
  const [updateMixTape, { isLoading: isUpdating }] = useUpdateMixTapeMutation();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<MixTapeFormValues>({
    resolver: zodResolver(mixtapeSchema) as any,
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
    } else if (isOpen) {
      form.reset({
        title: '',
        audioUrl: '',
        order: '',
      });
      setSelectedFile(null);
      setFileName('');
    }
  }, [mixtapeToEdit, isOpen, form]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setFileName(file.name);
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
            
            {/* File Upload Area */}
            <div className="space-y-2">
              <FormLabel className="text-[13px] font-semibold text-[#111620] uppercase tracking-wide">
                Cover Image
              </FormLabel>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {fileName ? (
                  <p className="text-sm font-medium text-primary">{fileName}</p>
                ) : (
                  <>
                    <Upload className="w-6 h-6 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Click to upload cover image</p>
                    <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                  </>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            <FormField
              control={form.control as any}
              name="title"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold text-[#111620] uppercase tracking-wide">
                    Title *
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Summer Vibes 2026"
                      className="h-12 rounded-xl border-gray-200 bg-white px-4 text-[15px] focus:ring-primary focus:border-primary placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control as any}
              name="audioUrl"
              render={({field}) => (
                <FormItem>
                  <FormLabel className="text-[13px] font-semibold text-[#111620] uppercase tracking-wide">
                    Audio URL
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://soundcloud.com/..."
                      className="h-12 rounded-xl border-gray-200 bg-white px-4 text-[15px] focus:ring-primary focus:border-primary placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
                      className="h-12 rounded-xl border-gray-200 bg-white px-4 text-[15px] focus:ring-primary focus:border-primary placeholder:text-gray-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-xs" />
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
