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
  image: z.any().optional(),
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue('image', file, {shouldValidate: true});

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      console.log('New Event Data:', data);
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success('Event Added Successfully!');
      form.reset();
      setImagePreview(null);
      onClose();
    } catch (error: any) {
      console.log(error);
      toast.error('Something went wrong');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* FIX 1: max-w-[700px] diye width fix kora hoyece (175 invalid chilo).
        FIX 2: max-h-[90vh] + overflow-y-auto diye scrolling add kora hoyece jate lomba na hoye jay.
        FIX 3: scrollbar hide kora hoyece clean look er jonno.
        FIX 4: rounded-[24px] diye perfect gol kora hoyece.
      */}
      <DialogContent className="max-w-200 w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-none rounded-3xl bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[22px] font-bold text-[#111620]">
              Add Event
            </DialogTitle>
            <p className="text-[14px] text-[#787878]">Upload venue photo</p>
          </DialogHeader>
        </div>

        <Form {...(form as any)}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-8 pb-8 space-y-5">
            {/* Image Upload Area - Height reduced to 160px for better proportion */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative w-full h-40 bg-[#F5F5F5] rounded-[14px] overflow-hidden cursor-pointer group border-2 border-dashed border-transparent hover:border-primary/20 transition-all">
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-[#787878]">
                  <Upload className="w-7 h-7 mb-2 stroke-[1.5]" />
                  <span className="text-[13px] font-medium">
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

            <div className="space-y-4">
              {/* Title */}
              <FormField
                control={form.control as any}
                name="title"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-[#111620] font-semibold text-[14px]">
                      Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date & Venue Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="date"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
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
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Venue
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Capability & Price Row */}
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control as any}
                  name="capacity"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Capability
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
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
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Ticket Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
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
                    <FormLabel className="text-[#111620] font-semibold text-[14px]">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-[#F5F5F5] border-transparent rounded-[10px] min-h-25 resize-none focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Action Button */}
            <div className="flex justify-end pt-3">
              <Button
                type="submit"
                className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-10 rounded-[10px] transition-all active:scale-[0.98] shadow-sm text-[14px]">
                Add Event
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
