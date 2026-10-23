'use client';

import React from 'react';
import { UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { ALL_GENRES, ProfileFormValues } from './profile.schema';

interface MusicGenresSectionProps {
  watch: UseFormWatch<ProfileFormValues>;
  setValue: UseFormSetValue<ProfileFormValues>;
}

export function MusicGenresSection({
  watch,
  setValue,
}: MusicGenresSectionProps) {
  const selectedGenres = watch('genres') || [];

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setValue(
        'genres',
        selectedGenres.filter((g) => g !== genre),
        { shouldDirty: true, shouldValidate: true },
      );
    } else {
      if (selectedGenres.length >= 4) {
        toast.error('You can select a maximum of 4 genres.');
        return;
      }
      setValue('genres', [...selectedGenres, genre], {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-sm p-6 md:p-8 h-full border border-gray-100">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-gray-200">
        <div>
          <h3 className="text-base font-bold text-gray-800">Music Genres</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Select up to 4 genres that best define your style.
          </p>
        </div>
        <span
          className={`text-xs font-semibold px-2.5 py-1 rounded-sm ${
            selectedGenres.length === 4
              ? 'bg-amber-50 text-amber-700 border border-amber-200'
              : 'bg-gray-100 text-gray-600 border border-gray-200'
          }`}>
          {selectedGenres.length} / 4 Selected
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {ALL_GENRES.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          const isDisabled = !isSelected && selectedGenres.length >= 4;

          return (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              disabled={isDisabled}
              className={`px-3.5 py-1.5 rounded-sm text-xs font-medium transition-colors border cursor-pointer ${
                isSelected
                  ? 'bg-red-50 border-red-300 text-red-500 font-semibold'
                  : isDisabled
                    ? 'bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed'
                    : 'bg-gray-100 border-transparent text-gray-500 hover:bg-gray-200'
              }`}>
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
}
