import {Template} from '@repo/types';
import Navbar from './Navbar';
import Hero from './Hero';
import About from './About';
import Contact from './Contact';
import BookingPage from './BookingPage';
import Story from './Story';
import LatestMixes from './LatestMixes';
import UpcomingEvents from './UpcomingEvents';
import Gallery from './Gallery';
import Footer from './Footer';

export const kenzoTemplate: Template = {
  id: 'kenzo',
  Navbar: Navbar,
  Footer: Footer,
  landingSections: [
    {id: 'hero', component: Hero},
    // {id: 'about', component: About},
    {id: 'story', component: Story},
    {id: 'latest-mixes', component: LatestMixes},
    {id: 'latest-mixes', component: UpcomingEvents},
    {id: 'latest-mixes', component: Gallery},
  ],
  BookingPage: BookingPage,
  defaultTheme: {
    primaryColor: '#FC3838',
    fontFamily: 'Inter',
  },
  defaultContent: {
    // Navbar Section Content
    navbar: {
      djName: 'KENZO',
    },

    // Hero Section Content
    hero: {
      heroTitle: 'Feel the Energy.\nOwn the Night.',
      heroDescription:
        'International DJ and producer bringing the best of Afro-fusion, Amapiano, and Deep House to stages worldwide.',
      heroImage: '/theme/kenzo/hero-dark.png',
      badgeText: 'AVAILABLE FOR BOOKING',
      primaryButtonText: 'Book The DJ',
      secondaryButtonText: 'Listen to Mixes',
    },

    // About Section Content
    about: {
      aboutText:
        'Kenzo is a premium theme designed for artists who value simplicity and power. Every element is crafted to highlight your music and brand.',
    },

    // Story Section Content
    story: {
      title: 'The Story',
      description1:
        'With over a decade of experience moving crowds from intimate underground clubs to massive festival stages, DJ Kenzo creates sonic journeys that blend cultural rhythms with modern electronic beats.',
      description2:
        'Known for seamless transitions and an unparalleled ability to read the room, every set is a unique experience tailored to elevate the moment.',
      mainImage: '/theme/kenzo/story.png',
      bgImage: '/theme/kenzo/stroy-bg.png',
      stats: [
        {value: '10+', label: 'Years Active'},
        {value: '500+', label: 'Shows'},
        {value: '25', label: 'Countries'},
      ],
    },
    // Contact/Footer Section Content
    contact: {
      title: 'Get In Touch',
      subtitle:
        'Ready to bring the energy to your next event? Drop a message below.',
      email: 'kenzo@aura-beats.com',
      phone: '+1 (555) 000-1111',
      location: 'Lagos, Nigeria',
    },

    latestMixes: {
      title: 'Latest Mixtapes',
      subtitle:
        'Listen to recent live sets and studio mixes to get a taste of the sound.',
      coverImage: '/theme/kenzo/mix-steps.png',
      tracks: [
        {
          id: 1,
          title: 'Summer Sessions Vol. 4',
          genre: 'Amapiano & Deep House Mix',
          duration: '1:05:30',
          currentTime: '24:15',
          progress: 35,
        },
        {
          id: 2,
          title: 'Autumn Beats Mix',
          genre: 'Chill Vibes',
          duration: '1:20:45',
          currentTime: '00:00',
          progress: 0,
        },
        {
          id: 3,
          title: 'Winter Wonderland',
          genre: 'Ambient Mix',
          duration: '1:15:10',
          currentTime: '00:00',
          progress: 0,
        },
        {
          id: 4,
          title: 'Spring Awakening',
          genre: 'Uplifting Mix',
          duration: '1:03:55',
          currentTime: '00:00',
          progress: 0,
        },
        {
          id: 5,
          title: 'Late Night Grooves',
          genre: 'Deep House',
          duration: '1:10:30',
          currentTime: '00:00',
          progress: 0,
        },
        {
          id: 6,
          title: 'Sunset Chillout',
          genre: 'Relaxing Mix',
          duration: '1:12:40',
          currentTime: '00:00',
          progress: 0,
        },
        {
          id: 7,
          title: 'Road Trip Anthems',
          genre: 'Indie Mix',
          duration: '1:25:00',
          currentTime: '00:00',
          progress: 0,
        },
      ],
    },

    events: {
      title: 'Upcoming Events',
      subtitle: 'Catch me live at these venues and festivals.',
      list: [
        {
          id: 1,
          day: '06',
          month: 'DEC',
          title: 'Global Tech Conference 2024',
          venue: 'Convention Center',
          location: 'San Francisco, USA',
        },
        {
          id: 2,
          day: '12',
          month: 'JAN',
          title: 'Winter Music Festival 2024',
          venue: 'Snow Valley Park',
          location: 'Aspen, USA',
        },
        {
          id: 3,
          day: '20',
          month: 'FEB',
          title: 'Culinary Expo 2024',
          venue: 'Downtown Plaza',
          location: 'Chicago, USA',
        },
      ],
    },

    gallery: {
      title: 'Gallery Highlights',
      subtitle: 'Energy from recent performances.',
      images: [
        '/theme/kenzo/default/gallary-1.png', // Left Top
        '/theme/kenzo/default/gallary-2.png', // Left Bottom
        '/theme/kenzo/default/gallary.png', // Center Large
        '/theme/kenzo/default/gallary-4.png', // Right Top
        '/theme/kenzo/default/gallary-3.png', // Right Bottom
      ],
    },

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

    booking: {
      title: 'Ready to book ?',
      description:
        'Fill out the form to request a booking. We will get back to you within 24 hours with availability and a quote.',
      contactInfo: {
        email: {
          title: 'Email Us',
          value: 'bookings@djaura.com',
        },
        location: {
          title: 'Based In',
          value: 'Los Angeles, CA - Available Worldwide',
        },
      },
    },
  },
  editorConfig: {
    navbar: {
      label: 'Navbar',
      fields: [
        {label: 'DJ Name', key: 'navbar.djName', type: 'text'},
      ],
    },
    hero: {
      label: 'Hero Section',
      fields: [
        {label: 'Main Title', key: 'hero.heroTitle', type: 'text'},
        {label: 'Sub Description', key: 'hero.heroDescription', type: 'textarea'},
        {label: 'Background Image', key: 'hero.heroImage', type: 'image'},
      ],
    },
    story: {
      label: 'The Story',
      fields: [
        {label: 'Description 1', key: 'story.description1', type: 'textarea'},
        {label: 'Description 2', key: 'story.description2', type: 'textarea'},
        {label: 'Main Image', key: 'story.mainImage', type: 'image'},
        {label: 'Background Image', key: 'story.bgImage', type: 'image'},
        {label: 'Stat 1 Value', key: 'story.stats.0.value', type: 'text'},
        {label: 'Stat 1 Label', key: 'story.stats.0.label', type: 'text'},
        {label: 'Stat 2 Value', key: 'story.stats.1.value', type: 'text'},
        {label: 'Stat 2 Label', key: 'story.stats.1.label', type: 'text'},
        {label: 'Stat 3 Value', key: 'story.stats.2.value', type: 'text'},
        {label: 'Stat 3 Label', key: 'story.stats.2.label', type: 'text'},
      ],
    },
    gallery: {
      label: 'Gallery Highlights',
      fields: [
        {label: 'Gallery Images', key: 'gallery.images', type: 'gallery'},
      ],
    },
    contact: {
      label: 'Contact Info',
      fields: [
        {label: 'Email Address', key: 'contact.email', type: 'text'},
        {label: 'Phone Number', key: 'contact.phone', type: 'text'},
        {label: 'Location', key: 'contact.location', type: 'text'},
      ],
    },
    social: {
      label: 'Social Links',
      fields: [
        {label: 'Instagram URL', key: 'social.instagram', type: 'text'},
        {label: 'Facebook URL', key: 'social.facebook', type: 'text'},
        {label: 'LinkedIn URL', key: 'social.linkedin', type: 'text'},
      ],
    },
  },
};
