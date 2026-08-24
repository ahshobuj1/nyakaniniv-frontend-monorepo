'use client';
import {cn} from '../lib/utils';
import {useScroll} from '../hooks/use-scroll';
import {Button} from './ui/button';
import {MobileNav} from './mobile-nav';
import Link from 'next/link';
import Image from 'next/image';
import {useState, useEffect} from 'react';
import {usePathname} from 'next/navigation';

export const navLinks = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Features',
    href: '/#features',
  },
  {
    label: 'How it Works',
    href: '/#howitworks',
  },
  {
    label: 'Themes',
    href: '/#themes',
  },
  {
    label: 'Pricing',
    href: '/pricing',
  },
  {
    label: 'Support',
    href: '/support',
  },
];

export interface HeaderProps {
  userDropdown?: React.ReactNode;
  logoUrl?: string;
}

export function Header({ userDropdown, logoUrl }: HeaderProps = {}) {
  const scrolled = useScroll(10);
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      let currentSection = '';

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top;

        if (sectionTop <= 150) {
          currentSection = `#${section.getAttribute('id')}`;
        }
      });

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href.startsWith('#')) {
      return activeSection === href;
    }
    if (href === '/') {
      return pathname === '/' && activeSection === '';
    }
    return pathname === href;
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto bg-[#f0f0f0] w-full max-w-[1440px] border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out',
        {
          'border-border bg-[#f0f0f0] backdrop-blur-sm supports-backdrop-filter:bg-white/70 md:top-2 md:max-w-5xl md:shadow':
            scrolled,
        },
      )}>
      <nav
        className={cn(
          'relative flex h-18 w-full items-center justify-between px-4 md:h-20 md:transition-all md:ease-out',
          {
            'md:px-2': scrolled,
          },
        )}>
        <Link
          className="rounded-md p-2 hover:bg-muted/50 transition-colors flex items-center"
          href="/">
          <Image
            src={logoUrl || '/home/upbeat.png'}
            width={240}
            height={70}
            priority
            alt="UpBeat Africa"
            className="h-12 md:h-16 w-auto object-contain [image-rendering:-webkit-optimize-contrast]"
            unoptimized={Boolean(logoUrl && (logoUrl.startsWith('http') || logoUrl.endsWith('.svg')))}
          />
        </Link>

        <div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Button
              asChild
              key={link.label}
              size="sm"
              variant="ghost"
              className={cn(
                'hover:bg-transparent hover:text-primary text-lg font-medium',
                isActive(link.href) ? 'text-primary' : 'text-[#888888]',
              )}>
              <Link href={link.href}>{link.label}</Link>
            </Button>
          ))}
        </div>

        <div className="hidden items-center md:flex">
          {userDropdown ? (
            userDropdown
          ) : (
            <Link href={'/auth/login'}>
              <Button
                size="lg"
                className="bg-primary rounded-[2px] px-10 py-4 text-lg font-semibold text-white hover:bg-[#e02a30]">
                Log In
              </Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 md:hidden">
          {userDropdown && <div className="scale-90 origin-right">{userDropdown}</div>}
          <MobileNav showLogin={!userDropdown} />
        </div>
      </nav>
    </header>
  );
}
