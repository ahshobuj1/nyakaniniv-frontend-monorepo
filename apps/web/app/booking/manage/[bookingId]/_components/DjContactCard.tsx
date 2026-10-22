'use client';

import {
  User,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
} from 'lucide-react';
import type { DjContactCardProps } from './types';

/**
 * Renders contact details panel.
 * If viewer is DJ, renders the Client's details.
 * If viewer is Client, renders the DJ's details.
 * If viewer is Admin, renders both for full audit transparency.
 */
export function DjContactCard({
  contact,
  clientContact,
  viewerRole = 'CLIENT',
}: DjContactCardProps) {
  // If DJ viewing, prioritize showing Client info
  if (viewerRole === 'DJ' && clientContact) {
    const cleanClientPhone = clientContact.phone ? clientContact.phone.replace(/[^\d+]/g, '') : '';
    return (
      <div className="space-y-3">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Client Information
        </h2>

        <div className="space-y-3 bg-gray-50/70 p-4 rounded-sm border border-gray-200/80 text-xs">
          <div className="flex items-start gap-3">
            <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-medium text-gray-400 uppercase block">Client Name</span>
              <span className="font-semibold text-gray-900 mt-0.5 block">{clientContact.name}</span>
            </div>
          </div>

          {clientContact.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-medium text-gray-400 uppercase block">Client Email</span>
                <a
                  href={`mailto:${clientContact.email}`}
                  className="font-semibold text-primary hover:underline mt-0.5 block">
                  {clientContact.email}
                </a>
              </div>
            </div>
          )}

          {clientContact.phone && (
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
              <div>
                <span className="text-[10px] font-medium text-gray-400 uppercase block">Client Phone</span>
                <a
                  href={`tel:${cleanClientPhone}`}
                  className="font-semibold text-gray-900 hover:underline mt-0.5 block">
                  {clientContact.phone}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
        Artist & DJ Contact
      </h2>

      <div className="space-y-3 bg-gray-50/70 p-4 rounded-sm border border-gray-200/80 text-xs">
        <div className="flex items-start gap-3">
          <User className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <span className="text-[10px] font-medium text-gray-400 uppercase block">Artist Name</span>
            <span className="font-semibold text-gray-900 mt-0.5 block">{contact.stageName}</span>
          </div>
        </div>

        {contact.email && (
          <div className="flex items-start gap-3">
            <Mail className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-medium text-gray-400 uppercase block">Direct Email</span>
              <a
                href={`mailto:${contact.email}`}
                className="font-semibold text-[var(--primary)] hover:underline mt-0.5 block"
              >
                {contact.email}
              </a>
            </div>
          </div>
        )}

        {contact.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-medium text-gray-400 uppercase block">Direct Phone</span>
              <a
                href={`tel:${contact.cleanPhone}`}
                className="font-semibold text-gray-900 hover:underline mt-0.5 block"
              >
                {contact.phone}
              </a>
            </div>
          </div>
        )}

        {contact.whatsapp && (
          <div className="flex items-start gap-3">
            <MessageCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <span className="text-[10px] font-medium text-emerald-800 uppercase block">WhatsApp</span>
              <a
                href={`https://wa.me/${contact.cleanWhatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-emerald-700 hover:underline mt-0.5 block"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        )}

        {contact.websiteUrl && (
          <div className="pt-1">
            <a
              href={contact.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-sm transition-colors"
            >
              <span>Visit Artist Profile & Mixes</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
