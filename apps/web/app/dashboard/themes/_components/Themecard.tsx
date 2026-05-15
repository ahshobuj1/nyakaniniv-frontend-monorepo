import {Button} from '@repo/ui';
import Image from 'next/image';

interface ThemeCardProps {
  title: string;
  description: string;
  imageUrl: string;
  onApply?: () => void;
  onPreview?: () => void;
}

export function ThemeCard({
  title,
  description,
  imageUrl,
  onApply,
  onPreview,
}: ThemeCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col gap-4">
      {/* Theme Image / Thumbnail */}
      <div className="w-full aspect-4/3 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">
        <Image
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
          width={500}
          height={500}
        />
      </div>

      {/* Theme Info */}
      <div className="flex flex-col gap-1 px-1">
        <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto pt-2">
        <Button
          onClick={onApply}
          className="bg-primary hover:bg-red-600 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
          Apply Theme
        </Button>

        <Button
          onClick={onPreview}
          className="bg-[#e5e7eb] hover:bg-gray-300 text-gray-800 text-sm font-semibold py-2.5 rounded-lg transition-colors">
          Preview
        </Button>
      </div>
    </div>
  );
}
