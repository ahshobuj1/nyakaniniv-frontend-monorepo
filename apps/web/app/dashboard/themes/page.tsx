import React from 'react';
import Link from 'next/link';

const themes = [
  {
    id: 'azura',
    name: 'Azura',
    description: 'A modern, high-energy theme for professional DJs. Focuses on mixes and bold typography.',
    previewImage: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070&auto=format&fit=crop',
    color: '#F63131',
  },
  {
    id: 'kenzo',
    name: 'Kenzo (Coming Soon)',
    description: 'Minimalist and elegant. Perfect for wedding and event DJs who want a clean look.',
    previewImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2070&auto=format&fit=crop',
    color: '#10b981',
    disabled: true,
  },
];

export default function ThemesPage() {
  // Mock current user
  const username = 'shobuj';
  const siteUrl = 'http://localhost:3001';

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900">Choose Your Theme</h1>
        <p className="mt-4 text-lg text-gray-600">
          Select a design that matches your DJ style. You can preview each theme with your actual content before making it live.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {themes.map((theme) => (
          <div 
            key={theme.id} 
            className={`group bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-xl ${theme.disabled ? 'opacity-75' : ''}`}
          >
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={theme.previewImage} 
                alt={theme.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span 
                  className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: theme.color }}
                >
                  {theme.id.toUpperCase()}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900">{theme.name}</h3>
              <p className="mt-2 text-gray-600 line-clamp-2 min-h-[3rem]">
                {theme.description}
              </p>
              
              <div className="mt-6 flex items-center gap-3">
                {theme.disabled ? (
                  <button disabled className="flex-1 bg-gray-100 text-gray-400 py-3 rounded-xl font-semibold cursor-not-allowed">
                    Coming Soon
                  </button>
                ) : (
                  <>
                    <Link 
                      href={`${siteUrl}/${username}?templateId=${theme.id}`}
                      target="_blank"
                      className="flex-1 text-center border border-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Preview
                    </Link>
                    <button className="flex-1 bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                      Select
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
