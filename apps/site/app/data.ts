import {Theme, Content} from '@repo/types';

export interface UserSiteData {
  username: string;
  templateId: string;
  theme: Theme;
  content: Content;
}

export const dummyUsers: Record<string, UserSiteData> = {
  shobuj: {
    username: 'shobuj',
    templateId: 'azura',
    theme: {
      primaryColor: '#F63131',
      fontFamily: 'Inter, sans-serif',
    },
    content: {
      djName: 'Shobuj',
      heroTitle: 'DJ Shobuj - The Rhythm Master',
      heroDescription:
        'Mixing the best of Afrobeat and Deep House for your special events.',
      heroImage:
        'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?q=80&w=2070&auto=format&fit=crop',
      aboutText:
        'DJ Shobuj has been performing for over 10 years in the most prestigious clubs.',
      email: 'shobuj@dj-saas.com',
    },
  },
  aura: {
    username: 'aura',
    templateId: 'azura',
    theme: {
      primaryColor: '#10b981',
      fontFamily: 'Roboto, sans-serif',
    },
    content: {
      djName: 'Aura',
      heroTitle: 'DJ Aura - Elevate Your Night',
      heroDescription:
        'Specializing in Amapiano and Gqom rhythms that move the soul.',
      heroImage:
        'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=2076&auto=format&fit=crop',
      aboutText:
        'DJ Aura brings a unique blend of energy and soul to every performance.',
      email: 'aura@dj-saas.com',
    },
  },
};
