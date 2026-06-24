export * from './event';

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

export type EditorField = {
  label: string;
  key: string;
  type: 'text' | 'textarea' | 'list' | 'image' | 'gallery';
};

export type EditorSection = {
  label: string;
  fields: EditorField[];
};

export type EditorConfig = Record<string, EditorSection>;

export type Template = {
  id: string;
  Navbar: React.ComponentType<any>;
  Footer: React.ComponentType<any>;
  landingSections: Section[];
  BookingPage: React.ComponentType<any>;
  defaultContent: Content;
  defaultTheme: Theme;
  editorConfig: EditorConfig;
};

export type Content = Record<string, any>;
