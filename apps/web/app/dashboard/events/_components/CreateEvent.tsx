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
  venueAddress: z.string().min(1, 'Venue address is required'),
  capacity: z.string().min(1, 'Capacity is required'),
  price: z.string().min(1, 'Price is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
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
      venueAddress: '',
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
        venueAddress: eventToEdit.venueAddress || '',
        capacity: eventToEdit.capacity?.toString() || '',
        price: eventToEdit.price?.toString() || '',
        description: eventToEdit.description || '',
      });
    } else if (isOpen) {
      form.reset({
        title: '',
        date: '',
        venue: '',
        venueAddress: '',
        capacity: '',
        price: '',
        description: '',
      });
    }
  }, [eventToEdit, isOpen, form]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Removed
  };

  const onSubmit = async (data: EventFormValues) => {
    try {
      const formattedDate = new Date(data.date).toISOString();
      const payload: any = {
        title: data.title,
        description: data.description,
        eventDate: formattedDate,
        venueName: data.venue,
        venueAddress: data.venueAddress,
        capacity: parseInt(data.capacity, 10),
        price: parseFloat(data.price),
      };

      if (eventToEdit) {
        await updateEvent({ id: eventToEdit.id, ...payload }).unwrap();
        toast.success('Event Updated Successfully!');
      } else {
        await createEvent(payload).unwrap();
        toast.success('Event Added Successfully!');
      }
      
      form.reset();
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
          </DialogHeader>
        </div>

        <Form {...(form as any)}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="px-8 pb-8 space-y-5">
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
                        placeholder="e.g. Lagos Nights Vol 4"
                        className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Date, Venue & Address Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          placeholder="Select event date"
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
                        Venue Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. O2 Arena"
                          className="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control as any}
                  name="venueAddress"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Venue Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. 123 Main St, London"
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
                          placeholder="e.g. 500"
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
                          placeholder="0.00"
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
                        placeholder="Provide details about the event..."
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
