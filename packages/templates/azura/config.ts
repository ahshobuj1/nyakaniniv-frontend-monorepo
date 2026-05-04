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
    heroImage: '/theme/aura/aura-hero.jpg',
    behindDecksTitle: 'Behind the Decks',
    behindDecksBio:
      'With over 8 years of experience rocking crowds from Nairobi to Lagos, DJ Aura blends traditional African rhythms with modern electronic beats.',
    behindDecksImage:
      'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=2076&auto=format&fit=crop',
    aboutText:
      'We are a DJ service dedicated to bringing the best music experience to your events. Our team of professionals ensures every beat is perfect.',
    email: 'contact@djkwamebeats.com',
    phone: '+233 55 123 4567',
    location: 'Accra, Ghana',
    title: 'Live In Action',
    subtitle: 'Energy from recent performances.',
    liveActionImages: [
      '/theme/aura/live-action-1.png',
      '/theme/aura/live-action-2.png',
      '/theme/aura/live-action-3.png',
      '/theme/aura/live-action-4.png',
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
};
