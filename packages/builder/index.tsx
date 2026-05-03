import {templates} from '@repo/templates';
import {Theme, Content} from '@repo/types';
import React from 'react';

interface TemplateRendererProps {
  templateId: string;
  content: Content;
  theme: Theme;
  view?: 'landing' | 'booking';
  onViewChange?: (view: 'landing' | 'booking') => void;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : '0, 0, 0';
}

export default function TemplateRenderer({
  templateId,
  content,
  theme,
  view = 'landing',
  onViewChange,
}: TemplateRendererProps) {
  const template = templates[templateId as keyof typeof templates];

  if (!template) return <div>Template not found</div>;

  const style = {
    '--primary': theme.primaryColor,
    '--primary-rgb': hexToRgb(theme.primaryColor),
    fontFamily: theme.fontFamily,
  } as React.CSSProperties;

  if (view === 'booking' && template.BookingPage) {
    const BookingPage = template.BookingPage;
    return (
      <div style={style}>
        <BookingPage 
          content={content} 
          theme={theme} 
          isPreview={true} 
          view={view}
          onViewChange={onViewChange}
        />
      </div>
    );
  }

  return (
    <div style={style}>
      {template.sections.map((section: any) => {
        const Component = section.component;
        return (
          <Component 
            key={section.id} 
            content={content} 
            view={view}
            onViewChange={onViewChange}
          />
        );
      })}
    </div>
  );
}

