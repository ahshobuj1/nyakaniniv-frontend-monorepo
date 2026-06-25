import {Template} from '@repo/types';
import Navbar from './Navbar';
import Hero from './Hero';
import BehindDecks from './BehindDecks';
import LatestMixes from './LatestMixes';
import UpcomingEvents from './About';
import LiveInAction from './LiveInAction';
import Footer from './Footer';
import BookingPage from './BookingPage';

export const azuraTemplate: Template = {
  id: 'azura',
  Navbar: Navbar,
  Footer: Footer,
  landingSections: [
    {id: 'hero', component: Hero},
    {id: 'behind-decks', component: BehindDecks},
    {id: 'latest-mixes', component: LatestMixes},
    {id: 'about', component: UpcomingEvents},
    {id: 'live-action', component: LiveInAction},
  ],
  BookingPage: BookingPage,
  defaultTheme: {
    primaryColor: '#ef4444',
    fontFamily: 'Inter',
  },
  defaultContent: {
    heroTitle: 'Bringing the energy to every dancefloor.',
    heroDescription:
      'Afrobeat, Amapiano, and Deep House specialist. Creating unforgettable rhythmic experiences across Africa and beyond.',
    heroImage: '/theme/aura/default/aura-hero-1.png',
    behindDecksTitle: 'Behind the Decks',
    behindDecksBio:
      'With over 8 years of experience rocking crowds from Nairobi to Lagos, DJ Aura blends traditional African rhythms with modern electronic beats.',
    behindDecksImage: '/theme/aura/default/aura-bihind-the-decks.png',
    aboutText:
      'We are a DJ service dedicated to bringing the best music experience to your events. Our team of professionals ensures every beat is perfect.',
    email: 'contact@djkwamebeats.com',
    phone: '+233 55 123 4567',
    location: 'Accra, Ghana',
    title: 'Live In Action',
    subtitle: 'Energy from recent performances.',
    liveActionImages: [
      '/theme/aura/default/live-action-1.png',
      '/theme/aura/default/live-action-2.png',
      '/theme/aura/default/live-action-3.png',
      '/theme/aura/default/live-action-4.png',
    ],
    footer: {
      logoText: 'DJ AURA',
      description:
        'Powered by UpBeat Africa - the platform where African Djs build their brand and grow their bookings.',
      instagram: '#',
      facebook: '#',
      linkedin: '#',
      quickLinks: [
        {label: 'Home', url: '#'},
        {label: 'About', url: '#'},
        {label: 'Music', url: '#'},
        {label: 'Events', url: '#'},
        {label: 'Gallery', url: '#'},
      ],
      contactEmail: 'djaura@gmail.com',
      contactPhone: '+254 712 345678.',
      contactLocation: 'Lagos, Nigeria',
      copyright: '© 2026 Dj Aura. All rights reserved',
      poweredBy: 'UpBeat Africa',
    },
  },
  editorConfig: {
    navbar: {
      label: 'Navbar',
      fields: [
        {label: 'DJ Name', key: 'djName', type: 'text'},
      ],
    },
    hero: {
      label: 'Hero Section',
      fields: [
        {label: 'Main Title', key: 'heroTitle', type: 'text'},
        {label: 'Sub Description', key: 'heroDescription', type: 'textarea'},
        {label: 'Background Image', key: 'heroImage', type: 'image'},
      ],
    },
    'behind-decks': {
      label: 'Behind the Decks',
      fields: [
        {label: 'Section Title', key: 'behindDecksTitle', type: 'text'},
        {label: 'Biography', key: 'behindDecksBio', type: 'textarea'},
        {label: 'Featured Image', key: 'behindDecksImage', type: 'image'},
        {label: 'Signature Sounds (Comma separated)', key: 'signatureSounds', type: 'text'},
        {label: 'Events Played', key: 'eventsPlayed', type: 'text'},
        {label: 'Cities Toured', key: 'citiesToured', type: 'text'},
      ],
    },
    gallery: {
      label: 'Live In Action / Gallery',
      fields: [
        {label: 'Gallery Title', key: 'title', type: 'text'},
        {label: 'Gallery Subtitle', key: 'subtitle', type: 'text'},
        {label: 'Gallery Images', key: 'liveActionImages', type: 'gallery'},
      ],
    },
    about: {
      label: 'About Section',
      fields: [{label: 'About Content', key: 'aboutText', type: 'textarea'}],
    },
    contact: {
      label: 'Contact Info',
      fields: [
        {label: 'Email Address', key: 'email', type: 'text'},
        {label: 'Phone Number', key: 'phone', type: 'text'},
        {label: 'Location', key: 'location', type: 'text'},
      ],
    },
    social: {
      label: 'Social Links',
      fields: [
        {label: 'Instagram URL', key: 'instagram', type: 'text'},
        {label: 'Facebook URL', key: 'facebook', type: 'text'},
        {label: 'LinkedIn URL', key: 'linkedin', type: 'text'},
      ],
    },

  },
};
