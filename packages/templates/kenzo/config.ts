import {Template} from '@repo/types';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Contact from './Contact';
import BookingPage from './BookingPage';

export const kenzoTemplate: Template = {
  id: 'kenzo',
  sections: [
    {id: 'navbar', component: Navbar},
    {id: 'hero', component: Hero},
    {id: 'about', component: About},
    {id: 'contact', component: Contact},
  ],
  BookingPage: BookingPage,
  defaultTheme: {
    primaryColor: '#ffffff',
    fontFamily: 'Inter',
  },
  defaultContent: {
    heroTitle: 'Kenzo Modern Beats',
    heroDescription: 'The future of sound is here. Minimalist vibes for the elite crowd.',
    aboutText: 'Kenzo is a premium theme designed for artists who value simplicity and power. Every element is crafted to highlight your music and brand.',
    email: 'kenzo@aura-beats.com',
    phone: '+1 (555) 000-1111',
  },
};
