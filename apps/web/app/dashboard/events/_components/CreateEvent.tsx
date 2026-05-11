/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState, useRef} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {Upload} from 'lucide-react';
import Image from 'next/image';
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
import {Textarea} from '@repo/ui';
import {Button} from '@repo/ui';

// ==========================================
// 1. Validation Schema
// ==========================================
const eventSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  date: z.string().min(1, 'Date is required'),
  venue: z.string().min(1, 'Venue is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  image: z.any().optional(), // image file accept korar jonne
});

type EventFormValues = z.infer<typeof eventSchema>;

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddEventModal({isOpen, onClose}: AddEventModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: 'Classical Evening Gala',
      date: '21/04/2026',
      venue: 'Royal Opera House, London, UK',
      capacity: '1500',
      price: '$ 100',
      description:
        'Experience an unforgettable evening with the esteemed Harmonious Sounds Orchestra...',
    },
  });

  // Handle Image Upload/Preview & set to React Hook Form
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 1. React Hook Form er state a file ta save kora
      form.setValue('image', file, {shouldValidate: true});

      // 2. UI te preview dekhanor jonne FileReader use kora
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      // akhane data.image er modde apnar actual file ta thakbe
      console.log('New Event Data:', data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success('Event Added Successfully!');
      form.reset(); // Form reset kora
      setImagePreview(null); // Preview clear kora
      onClose(); // Modal close kora
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-175 p-0 overflow-hidden border-none rounded-[20px] bg-white">
        {/* Header */}
        <div className="p-8 pb-0">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-2xl font-bold text-[#111620]">
              Add Event
            </DialogTitle>
            <p className="text-sm text-[#787878]">Upload venue photo</p>
          </DialogHeader>
        </div>

        {/* FIX: TS Error bypass using 'as any' for monorepo mismatch */}
        <Form {...(form as any)}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-8 space-y-6">
            {/* Image Upload Area */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-50 bg-[#F5F5F5] rounded-xl overflow-hidden cursor-pointer group border-2 border-dashed border-transparent hover:border-primary/20 transition-all">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#787878]">
                  <Upload className="w-8 h-8 mb-2 stroke-[1.5]" />
                  <span className="text-sm font-medium">
                    Click to upload venue image
                  </span>
                </div>
              )}
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  variant="secondary"
                  className="bg-white/90 backdrop-blur-sm hover:bg-white text-xs text-[#111620]">
                  Change Photo
                </Button>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
            </div>

            <div className="space-y-5">
              {/* Title */}
              <FormField
                control={form.control as any}
                name="title"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-[#111620] font-semibold">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-[#F5F5F5] border-transparent h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date & Venue Row */}
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control as any}
                  name="date"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold">
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="venue"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold">
                        Venue
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Capability & Price Row */}
              <div className="grid grid-cols-2 gap-5">
                <FormField
                  control={form.control as any}
                  name="capacity"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold">
                        Capability
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="price"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold">
                        Ticket Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-12 rounded-lg focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={form.control as any}
                name="description"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-[#111620] font-semibold">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-[#F5F5F5] border-transparent rounded-lg min-h-30 resize-none focus-visible:ring-1 focus-visible:ring-primary shadow-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-10 rounded-lg transition-all active:scale-[0.98] shadow-sm">
                Add Event
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
