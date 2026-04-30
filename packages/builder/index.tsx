import {templates} from '@repo/templates';
import {Theme, Content} from '@repo/types';
import React from 'react';

interface TemplateRendererProps {
  templateId: string;
  content: Content;
  theme: Theme;
}

export default function TemplateRenderer({templateId, content, theme}: TemplateRendererProps) {
  const template = templates[templateId as keyof typeof templates];

  return (
    <div
      style={
        {
          '--primary': theme.primaryColor,
          fontFamily: theme.fontFamily,
        } as React.CSSProperties
      }>
      {template.sections.map((section: any) => {
        const Component = section.component;
        return <Component key={section.id} content={content} />;
      })}
    </div>
  );
}
