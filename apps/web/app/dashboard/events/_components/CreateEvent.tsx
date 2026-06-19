/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {useState, useRef, useEffect} from 'react';
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
import { useCreateEventMutation, useUpdateEventMutation } from '@repo/store';

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
  eventToEdit?: any;
}

export default function AddEventModal({isOpen, onClose, eventToEdit}: AddEventModalProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      date: '',
      venue: '',
      capacity: '',
      price: '',
      description: '',
    },
  });

  useEffect(() => {
    if (eventToEdit && isOpen) {
      // Pre-fill form if editing
      form.reset({
        title: eventToEdit.title || '',
        // Use YYYY-MM-DD for datetime-local input or standard text input. Assuming standard text input for now.
        date: eventToEdit.eventDate ? new Date(eventToEdit.eventDate).toISOString().split('T')[0] : '', 
        venue: eventToEdit.venueName || '',
        capacity: eventToEdit.capacity?.toString() || '',
        price: eventToEdit.price?.toString() || '',
        description: eventToEdit.description || '',
      });
      if (eventToEdit.coverUrl || eventToEdit.image) {
        setImagePreview(eventToEdit.coverUrl || eventToEdit.image);
      } else {
        setImagePreview(null);
      }
    } else if (isOpen) {
      form.reset({
        title: '',
        date: '',
        venue: '',
        capacity: '',
        price: '',
        description: '',
      });
      setImagePreview(null);
    }
  }, [eventToEdit, isOpen, form]);

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
      const formattedDate = new Date(data.date).toISOString();
      const payload: any = {
        title: data.title,
        description: data.description,
        eventDate: formattedDate,
        venueName: data.venue,
        capacity: parseInt(data.capacity, 10),
        price: parseFloat(data.price),
      };

      if (data.image) {
        payload.coverImage = data.image;
      }

      if (eventToEdit) {
        await updateEvent({ id: eventToEdit.id, ...payload }).unwrap();
        toast.success('Event Updated Successfully!');
      } else {
        await createEvent(payload).unwrap();
        toast.success('Event Added Successfully!');
      }
      
      form.reset();
      setImagePreview(null);
      onClose();
    } catch (error: any) {
      console.log(error);
      const errorMsg = error?.data?.error?.message || error?.data?.message || 'Failed to save event';
      toast.error(errorMsg);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-200 w-[95vw] max-h-[90vh] overflow-y-auto p-0 border-none rounded-3xl bg-white [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Header */}
        <div className="px-8 pt-8 pb-4">
          <DialogHeader className="space-y-1">
            <DialogTitle className="text-[22px] font-bold text-[#111620]">
              {eventToEdit ? 'Edit Event' : 'Add Event'}
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
                          type="date"
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
                        Capacity
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
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
                          type="number"
                          step="0.01"
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
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-10 rounded-[10px] transition-all active:scale-[0.98] shadow-sm text-[14px] disabled:opacity-70">
                {isSubmitting ? 'Saving...' : eventToEdit ? 'Save Changes' : 'Add Event'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
