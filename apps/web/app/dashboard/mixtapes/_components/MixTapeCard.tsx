'use client';

import { Edit, Trash2, Music } from 'lucide-react';
import { Card, CardContent } from '@repo/ui';
import { MixTape } from '@repo/store';

interface MixTapeCardProps {
  mixtape: MixTape;
  onEdit: () => void;
  onDelete: () => void;
}

export function MixTapeCard({ mixtape, onEdit, onDelete }: MixTapeCardProps) {
  return (
    <Card className="group border-none shadow-[0_2px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 overflow-hidden rounded-2xl bg-white">
      <CardContent className="p-0 flex flex-col h-full">
        {/* Image Section */}
        <div className="relative aspect-video w-full overflow-hidden bg-gray-100 flex items-center justify-center">
          {mixtape.coverUrl ? (
            <img
              src={mixtape.coverUrl}
              alt={mixtape.title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <Music className="w-12 h-12 text-gray-300" />
          )}

          {/* Action Buttons overlay */}
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onEdit}
              className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white text-gray-700 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
              title="Edit">
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-2 bg-white/90 backdrop-blur-sm hover:bg-red-50 text-red-600 rounded-lg shadow-sm transition-all hover:-translate-y-0.5"
              title="Delete">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-[18px] text-[#111620] leading-tight line-clamp-1">
              {mixtape.title}
            </h3>
          </div>

          <div className="mt-auto pt-4 border-t border-gray-100">
            {mixtape.audioUrl ? (
              <audio controls className="w-full h-10" src={mixtape.audioUrl}>
                Your browser does not support the audio element.
              </audio>
            ) : (
              <p className="text-sm text-gray-400 italic">No audio available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
