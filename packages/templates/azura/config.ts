import {Template} from '@repo/types';
import Navbar from './Navbar';
import Hero from './Hero';
import BehindDecks from './BehindDecks';
import LatestMixes from './LatestMixes';
import About from './About';
import Contact from './Contact';

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
};

