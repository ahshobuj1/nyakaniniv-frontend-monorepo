import {Template} from '@repo/types';
import Navbar from './Navbar';
import Hero from './Hero';
import BehindDecks from './BehindDecks';
import LatestMixes from './LatestMixes';
import About from './About';
import Contact from './Contact';
import BookingPage from './BookingPage';

export const azuraTemplate: Template = {
  id: 'azura',
  sections: [
    {id: 'navbar', component: Navbar},
    {id: 'hero', component: Hero},
    {id: 'behind-decks', component: BehindDecks},
    {id: 'latest-mixes', component: LatestMixes},
    {id: 'about', component: About},
    {id: 'contact', component: Contact},
  ],
  BookingPage: BookingPage,
  defaultTheme: {
    primaryColor: '#ef4444',
    fontFamily: 'Inter',
  },
  defaultContent: {
    heroTitle: 'Bringing the energy to every dancefloor.',
    heroDescription: 'Afrobeat, Amapiano, and Deep House specialist. Creating unforgettable rhythmic experiences across Africa and beyond.',
    heroImage: 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070&auto=format&fit=crop',
    behindDecksTitle: 'Behind the Decks',
    behindDecksBio: 'With over 8 years of experience rocking crowds from Nairobi to Lagos, DJ Aura blends traditional African rhythms with modern electronic beats.',
    behindDecksImage: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=2076&auto=format&fit=crop',
    aboutText: 'We are a DJ service dedicated to bringing the best music experience to your events. Our team of professionals ensures every beat is perfect.',
    email: 'contact@djkwamebeats.com',
    phone: '+233 55 123 4567',
    location: 'Accra, Ghana',
  },
};

