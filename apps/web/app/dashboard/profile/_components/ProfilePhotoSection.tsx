'use client';

import React, {useEffect, useRef, useState} from 'react';
import Image from 'next/image';
import {UseFormSetValue, UseFormWatch} from 'react-hook-form';
import {ProfileFormValues} from './profile.schema';

interface ProfilePhotoSectionProps {
  watch: UseFormWatch<ProfileFormValues>;
  setValue: UseFormSetValue<ProfileFormValues>;
  initialProfileImg?: string | null;
}

export function ProfilePhotoSection({
  watch,
  setValue,
  initialProfileImg,
}: ProfilePhotoSectionProps) {
  const firstName = watch('firstName');
  const lastName = watch('lastName');

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  // Revoke previous object URL on cleanup
  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      const newUrl = URL.createObjectURL(file);
      objectUrlRef.current = newUrl;
      setPreviewUrl(newUrl);
      setValue('profileImage', file, {shouldDirty: true});
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-100 p-6 md:p-8 flex flex-col items-center sm:flex-row sm:items-start gap-6">
      <div className="relative group">
        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex items-center justify-center relative">
          {previewUrl ? (
            <Image
              src={previewUrl}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : initialProfileImg ? (
            <Image
              src={initialProfileImg}
              alt="Profile"
              fill
              className="object-cover"
            />
          ) : (
            <span className="text-3xl text-gray-400 font-bold select-none">
              {firstName?.[0] || 'D'}
              {lastName?.[0] || 'J'}
            </span>
          )}

          <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <span className="text-white text-xs font-semibold">Upload</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      <div className="text-center sm:text-left mt-2 sm:mt-4">
        <h3 className="text-lg font-bold text-gray-900">Profile Image</h3>
        <p className="text-sm text-gray-500 max-w-sm mt-1">
          Upload a professional picture. It will be displayed on your dashboard.
        </p>
      </div>
    </div>
  );
}
