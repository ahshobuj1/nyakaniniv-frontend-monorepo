import {Template} from '@repo/types';
import Hero from './Hero';
import About from './About';
import Contact from './Contact';

export const azuraTemplate: Template = {
  id: 'azura',
  sections: [
    {id: 'hero', component: Hero},
    {id: 'about', component: About},
    {id: 'contact', component: Contact},
  ],
};
