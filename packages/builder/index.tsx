import {templates} from '@repo/templates';
import {Theme, Content} from '@repo/types';
import React from 'react';

interface TemplateRendererProps {
  templateId: string;
  content: Content;
  theme: Theme;
  view?: 'landing' | 'booking';
  onViewChange?: (view: 'landing' | 'booking') => void;
  baseUrl?: string;
}

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1] as string, 16)}, ${parseInt(result[2] as string, 16)}, ${parseInt(result[3] as string, 16)}`
    : '0, 0, 0';
}

export default function TemplateRenderer({
  templateId,
  content,
  theme,
  view = 'landing',
  onViewChange,
  baseUrl,
}: TemplateRendererProps) {
  const template = templates[templateId as keyof typeof templates];

  if (!template) return <div>Template not found</div>;

  const selectedFont = theme.fontFamily || 'Inter';
  const fallbackCategory = selectedFont === 'Playfair Display' ? 'serif' : ['Patrick Hand', 'Kalam', 'Caveat', 'Dancing Script', 'Permanent Marker'].includes(selectedFont) ? 'cursive' : 'sans-serif';
  const fontFamilyValue = `"${selectedFont}", ${fallbackCategory}`;

  const style = {
    '--primary': theme.primaryColor,
    '--primary-rgb': hexToRgb(theme.primaryColor),
    '--theme-font': fontFamilyValue,
    fontFamily: fontFamilyValue,
  } as React.CSSProperties;

  const Navbar = template.Navbar;
  const Footer = template.Footer;

  return (
    <div data-theme-root style={style} className="relative flex flex-col min-h-screen w-full">
      <style>{`
        [data-theme-root],
        [data-theme-root] h1,
        [data-theme-root] h2,
        [data-theme-root] h3,
        [data-theme-root] h4,
        [data-theme-root] h5,
        [data-theme-root] h6,
        [data-theme-root] p,
        [data-theme-root] span,
        [data-theme-root] a,
        [data-theme-root] button,
        [data-theme-root] input,
        [data-theme-root] textarea,
        [data-theme-root] select,
        [data-theme-root] label {
          font-family: var(--theme-font) !important;
          font-style: normal !important;
        }
      `}</style>
      <Navbar 
        content={content} 
        theme={theme} 
        view={view} 
        onViewChange={onViewChange} 
        baseUrl={baseUrl}
      />
      
      <main>
        {view === 'booking' ? (
          <template.BookingPage 
            content={content} 
            theme={theme} 
            view={view}
            onViewChange={onViewChange}
          />
        ) : (
          template.landingSections.map((section: any) => {
            const Component = section.component;
            return (
              <Component 
                key={section.id} 
                content={content} 
                view={view}
                onViewChange={onViewChange}
              />
            );
          })
        )}
      </main>

      <Footer 
        content={content} 
        theme={theme} 
        view={view} 
        onViewChange={onViewChange} 
      />
    </div>
  );
}

