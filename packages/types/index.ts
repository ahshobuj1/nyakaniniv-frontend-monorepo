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
  sections: Section[];
};

export type Content = Record<string, any>;
