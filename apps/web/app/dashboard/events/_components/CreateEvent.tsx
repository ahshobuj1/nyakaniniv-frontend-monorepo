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
import {Button, DatePicker, AddressAutocomplete} from '@repo/ui';
import { useCreateEventMutation, useUpdateEventMutation, useGetCurrentProfileQuery } from '@repo/store';
import { AFRICAN_TIMEZONES, getCountryTimezone } from '@/lib/timezone';

// ==========================================
// 1. Validation Schema
// ==========================================
const eventSchema = z.object({
  title: z.string().min(2, 'Title is too short'),
  date: z.string().min(1, 'Date is required'),
  time: z.string().optional(),
  timezone: z.string().optional(),
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
  const { data: userProfile } = useGetCurrentProfileQuery();
  const djCountry = userProfile?.data?.tenant?.country || userProfile?.data?.tenant?.city || '';
  const djDefaultTz = getCountryTimezone(djCountry).code;

  const [createEvent, { isLoading: isCreating }] = useCreateEventMutation();
  const [updateEvent, { isLoading: isUpdating }] = useUpdateEventMutation();

  const isSubmitting = isCreating || isUpdating;

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema) as any,
    defaultValues: {
      title: '',
      date: '',
      time: '',
      timezone: djDefaultTz || 'EAT',
      venue: '',
      venueAddress: '',
      capacity: '',
      price: '',
      description: '',
    },
  });

  useEffect(() => {
    if (eventToEdit && isOpen) {
      // Parse time and timezone if combined e.g. "20:00 WAT"
      let existingTime = eventToEdit.eventTime || '';
      let existingTz = djDefaultTz || 'EAT';
      if (existingTime) {
        const parts = existingTime.trim().split(' ');
        if (parts.length > 1 && ['EAT', 'WAT', 'GMT', 'SAST', 'UTC'].includes(parts[parts.length - 1].toUpperCase())) {
          existingTz = parts[parts.length - 1].toUpperCase();
          existingTime = parts.slice(0, parts.length - 1).join(' ');
        }
      }

      form.reset({
        title: eventToEdit.title || '',
        date: eventToEdit.eventDate ? new Date(eventToEdit.eventDate).toISOString().split('T')[0] : '', 
        time: existingTime,
        timezone: existingTz,
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
        time: '',
        timezone: djDefaultTz || 'EAT',
        venue: '',
        venueAddress: '',
        capacity: '',
        price: '',
        description: '',
      });
    }
  }, [eventToEdit, isOpen, form, djDefaultTz]);

  const onSubmit = async (data: EventFormValues) => {
    try {
      const timePart = data.time ? `${data.time}:00` : '00:00:00';
      const formattedDate = new Date(`${data.date}T${timePart}`).toISOString();
      const combinedTime = data.time ? `${data.time} ${data.timezone}` : undefined;
      const payload: any = {
        title: data.title,
        description: data.description,
        eventDate: formattedDate,
        eventTime: combinedTime,
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

              {/* Date & Time Row */}
              <div className="grid grid-cols-1 gap-4">
                <FormField
                  control={form.control as any}
                  name="date"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Event Date
                      </FormLabel>
                      <FormControl>
                        <DatePicker
                          date={field.value}
                          onSelect={(d) => {
                            if (d) {
                              const y = d.getFullYear();
                              const m = String(d.getMonth() + 1).padStart(2, '0');
                              const day = String(d.getDate()).padStart(2, '0');
                              field.onChange(`${y}-${m}-${day}`);
                            } else {
                              field.onChange('');
                            }
                          }}
                          placeholder="Select event date"
                          minDate={new Date()}
                          buttonClassName="bg-[#F5F5F5] border-transparent h-11 rounded-[10px] focus-visible:ring-1 focus-visible:ring-primary shadow-none text-[14px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                   <FormField
                  control={form.control as any}
                  name="time"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Event Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="time"
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
                  name="timezone"
                  render={({field}) => (
                    <FormItem>
                      <FormLabel className="text-[#111620] font-semibold text-[14px]">
                        Timezone
                      </FormLabel>
                      <FormControl>
                        <select
                          {...field}
                          className="w-full bg-[#F5F5F5] border-transparent h-11 rounded-[10px] px-3 focus-visible:ring-1 focus-visible:ring-primary text-[14px] text-gray-800 outline-none cursor-pointer"
                        >
                          {AFRICAN_TIMEZONES.map((tz) => (
                            <option key={tz.code} value={tz.code}>
                              {tz.code} ({tz.country})
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                </div>
               
              </div>

              {/* Venue & Address Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                        <AddressAutocomplete
                          value={field.value}
                          onChange={field.onChange}
                          onSelectTimezone={(tz) => form.setValue('timezone', tz)}
                          placeholder="e.g. Victoria Island, Lagos / Westlands, Nairobi"
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
                        Ticket Price (KES)
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
