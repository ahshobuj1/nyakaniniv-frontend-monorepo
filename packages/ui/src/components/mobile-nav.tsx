import {cn} from '../lib/utils';
import React from 'react';
import {Portal, PortalBackdrop} from './ui/portal';
import {Button} from './ui/button';
import {navLinks} from './header';
import {XIcon, MenuIcon} from 'lucide-react';
import Link from 'next/link';

export function MobileNav({ showLogin = true }: { showLogin?: boolean }) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline">
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              'data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in',
              'size-full p-4',
            )}
            data-slot={open ? 'open' : 'closed'}>
            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  asChild
                  className="justify-start hover:text-primary text-base py-3"
                  key={link.label}
                  variant="ghost"
                  onClick={() => setOpen(false)}>
                  <Link href={link.href} onClick={() => setOpen(false)}>
                    {link.label}
                  </Link>
                </Button>
              ))}
            </div>
            <div className="mt-12 flex flex-col gap-2">
              {showLogin && (
                <Link href={'/auth/login'} onClick={() => setOpen(false)}>
                  <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white font-semibold" variant="default">
                    Log In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
