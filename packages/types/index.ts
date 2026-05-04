import React from 'react';

export type Theme = {
  primaryColor: string;
  secondaryColor?: string;
  fontFamily: string;
};

export type Section = {
  id: string;
  component: React.ComponentType<any>;
};

export type Template = {
  id: string;
  Navbar: React.ComponentType<any>;
  Footer: React.ComponentType<any>;
  landingSections: Section[];
  BookingPage: React.ComponentType<any>;
  defaultContent: Content;
  defaultTheme: Theme;
};

export type Content = Record<string, any>;
