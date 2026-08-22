'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Loader2 } from 'lucide-react';
import { Input } from '@repo/ui';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelectTimezone?: (timezoneCode: string) => void;
  placeholder?: string;
  className?: string;
}

function formatCleanAddress(item: any): string {
  if (!item.address) return item.display_name;

  const addr = item.address;
  const placeName = item.name || addr.amenity || addr.building || addr.shop || addr.tourism || addr.leisure || '';
  const road = addr.road || addr.street || addr.pedestrian || '';
  const area = addr.suburb || addr.neighbourhood || addr.city_district || addr.quarter || addr.residential || '';
  const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || '';
  const country = addr.country || '';

  const components: string[] = [];
  
  if (placeName && !components.includes(placeName)) {
    components.push(placeName);
  }
  if (road && !components.includes(road) && (!placeName || !placeName.toLowerCase().includes(road.toLowerCase()))) {
    components.push(road);
  }
  if (area && !components.includes(area) && (!placeName || !placeName.toLowerCase().includes(area.toLowerCase()))) {
    components.push(area);
  }
  if (city && !components.includes(city) && !area.toLowerCase().includes(city.toLowerCase())) {
    components.push(city);
  }
  if (country && !components.includes(country)) {
    components.push(country);
  }

  if (components.length > 0) {
    return components.join(', ');
  }

  // Fallback: take first 3 and last 1 comma-separated parts from display_name
  const parts = (item.display_name || '').split(',').map((p: string) => p.trim());
  if (parts.length > 4) {
    return `${parts.slice(0, 2).join(', ')}, ${parts[parts.length - 2] || ''}, ${parts[parts.length - 1]}`;
  }
  return item.display_name;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelectTimezone,
  placeholder = 'e.g. Victoria Island, Lagos, Nigeria',
  className,
}: AddressAutocompleteProps) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            query
          )}&addressdetails=1&limit=5`,
          {
            headers: {
              'Accept-Language': 'en',
            },
          }
        );
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data || []);
          setIsOpen(true);
        }
      } catch (err) {
        console.error('Failed to fetch address suggestions', err);
      } finally {
        setIsLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (item: any) => {
    const cleanAddress = formatCleanAddress(item);
    setQuery(cleanAddress);
    onChange(cleanAddress);
    setIsOpen(false);

    if (onSelectTimezone) {
      const full = (item.display_name || '').toLowerCase();
      if (full.includes('nigeria') || full.includes('lagos') || full.includes('abuja')) {
        onSelectTimezone('WAT');
      } else if (full.includes('ghana') || full.includes('accra')) {
        onSelectTimezone('GMT');
      } else if (full.includes('south africa') || full.includes('johannesburg') || full.includes('cape town')) {
        onSelectTimezone('SAST');
      } else if (full.includes('kenya') || full.includes('nairobi') || full.includes('mombasa')) {
        onSelectTimezone('EAT');
      }
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          className={className}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-primary" />
          ) : (
            <MapPin className="w-4 h-4 text-gray-400" />
          )}
        </div>
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto divide-y divide-gray-100 py-1">
          {suggestions.map((item, idx) => {
            const cleanAddr = formatCleanAddress(item);
            const title = item.name || item.address?.amenity || item.address?.road || cleanAddr.split(',')[0];
            return (
              <li
                key={idx}
                onClick={() => handleSelect(item)}
                className="px-3.5 py-2.5 hover:bg-gray-50 cursor-pointer flex items-start gap-2.5 text-[13px] text-gray-700 transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 truncate">
                  <p className="font-semibold text-gray-900 truncate">
                    {title}
                  </p>
                  <p className="text-[11px] text-gray-500 truncate">{cleanAddr}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
