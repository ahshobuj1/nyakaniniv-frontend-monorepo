import React from 'react';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="mt-2 text-gray-600">
          Quickly manage your professional DJ presence.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-900">Active Theme</h3>
          <p className="mt-1 text-sm text-gray-500">Currently using Azura</p>
          <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-gray-100">
            {/* <img
              src="https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070&auto=format&fit=crop"
              className="w-full h-full object-cover"
              alt="Active Theme"
            /> */}
          </div>
          <Link
            href="/dashboard/themes"
            className="mt-4 block text-center py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
            Change Theme
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Site Content</h3>
            <p className="mt-1 text-sm text-gray-500">
              Update your bio, mixes, and contacts.
            </p>
          </div>
          <Link
            href="/dashboard/content"
            className="mt-4 block text-center py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors">
            Edit Content
          </Link>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900">Live Status</h3>
            <p className="mt-1 text-sm text-gray-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" /> Online
            </p>
          </div>
          <Link
            href="http://localhost:3001/shobuj"
            target="_blank"
            className="mt-4 block text-center py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
            View Live Site
          </Link>
        </div>
      </div>
    </div>
  );
}
