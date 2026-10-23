'use client';

import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ProfileFormValues, inputBaseClass, labelClass } from './profile.schema';

interface SocialLinksSectionProps {
  register: UseFormRegister<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
}

export function SocialLinksSection({
  register,
  errors,
}: SocialLinksSectionProps) {
  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8">
      <h3 className="text-base font-bold text-gray-800 pb-6 mb-6 border-b border-gray-200">
        Social Links
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Instagram URL</label>
          <input
            {...register('socialLinks.instagram')}
            placeholder="https://instagram.com/djkwame"
            className={inputBaseClass}
          />
          {errors.socialLinks?.instagram && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.socialLinks.instagram.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>Facebook URL</label>
          <input
            {...register('socialLinks.facebook')}
            placeholder="https://facebook.com/djkwame"
            className={inputBaseClass}
          />
          {errors.socialLinks?.facebook && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.socialLinks.facebook.message}
            </p>
          )}
        </div>

        <div>
          <label className={labelClass}>LinkedIn URL</label>
          <input
            {...register('socialLinks.linkedin')}
            placeholder="https://linkedin.com/in/djkwame"
            className={inputBaseClass}
          />
          {errors.socialLinks?.linkedin && (
            <p className="text-red-500 text-xs mt-1.5">
              {errors.socialLinks.linkedin.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
