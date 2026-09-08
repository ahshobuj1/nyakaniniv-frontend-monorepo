import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  xs: 'h-4 w-auto',
  sm: 'h-5 w-auto',
  md: 'h-6 w-auto',
  lg: 'h-8 w-auto',
};

// 1. M-Pesa (Safaricom / Vodacom East Africa)
export function MpesaLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center font-black tracking-tighter px-1.5 py-0.5 rounded bg-[#00A859] text-white select-none ${sizeClasses[size]} ${className}`}
      title="M-Pesa"
    >
      <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">M-PESA</span>
    </div>
  );
}

// 2. Airtel Money
export function AirtelMoneyLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center font-bold px-1.5 py-0.5 rounded bg-[#ED1C24] text-white select-none ${sizeClasses[size]} ${className}`}
      title="Airtel Money"
    >
      <span className="text-[10px] sm:text-[11px] font-bold tracking-tight">airtel</span>
    </div>
  );
}

// 3. Tigo Pesa
export function TigoPesaLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center font-extrabold px-1.5 py-0.5 rounded bg-[#003366] text-[#FDB913] select-none ${sizeClasses[size]} ${className}`}
      title="Tigo Pesa"
    >
      <span className="text-[10px] sm:text-[11px] font-black tracking-tight">tigo</span>
    </div>
  );
}

// 4. MTN MoMo
export function MtnMomoLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center font-bold px-1.5 py-0.5 rounded-full bg-[#FFCC00] text-[#002B49] border border-[#E6B800] select-none ${sizeClasses[size]} ${className}`}
      title="MTN Mobile Money"
    >
      <span className="text-[9px] sm:text-[10px] font-black tracking-wider px-0.5">MoMo</span>
    </div>
  );
}

// 5. Visa Logo
export function VisaLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white border border-gray-200 px-1.5 py-0.5 rounded font-black italic select-none text-[#1A1F71] ${sizeClasses[size]} ${className}`}
      title="Visa"
    >
      <span className="text-[11px] font-black tracking-widest">VISA</span>
    </div>
  );
}

// 6. Mastercard Logo (Interlocking Red & Yellow Circles)
export function MastercardLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-white border border-gray-200 px-1.5 py-0.5 rounded select-none ${sizeClasses[size]} ${className}`}
      title="Mastercard"
    >
      <svg className="w-5 h-3.5" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="11" cy="10" r="9" fill="#EB001B" />
        <circle cx="21" cy="10" r="9" fill="#F79E1B" fillOpacity="0.9" />
      </svg>
    </div>
  );
}

// 7. Apple Pay Logo
export function ApplePayLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-black text-white px-1.5 py-0.5 rounded select-none ${sizeClasses[size]} ${className}`}
      title="Apple Pay"
    >
      <svg className="w-3 h-3 mr-0.5 fill-current" viewBox="0 0 170 170">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.03-7.6-7.85-11.75-14.44-6.1-9.74-10.89-20.91-14.38-33.52-3.48-12.61-5.23-24.52-5.23-35.73 0-16.14 3.99-29.62 11.96-40.45 7.97-10.83 18.25-16.37 30.84-16.63 4.79 0 10.14 1.25 16.06 3.75 5.92 2.5 9.77 3.75 11.55 3.75 1.57 0 5.46-1.25 11.66-3.75 6.21-2.5 11.39-3.69 15.54-3.56 12.18.63 22.18 5.34 30 14.13-10.65 6.45-15.86 15.51-15.63 27.18.23 9.4 3.86 17.29 10.89 23.68 7.03 6.39 15.22 10.05 24.57 11-2.22 6.78-4.99 13.91-8.31 21.39zM119.22 33.63c0-7.39 2.66-14.44 7.98-21.16 5.32-6.72 11.9-11.13 19.74-13.23.44 1.48.66 2.9.66 4.26 0 7.39-2.73 14.54-8.19 21.46-5.46 6.92-12.22 11.41-20.29 13.48-.44-1.48-.66-2.9-.66-4.81h.76z" />
      </svg>
      <span className="text-[10px] font-bold tracking-tight">Pay</span>
    </div>
  );
}

// 8. Bank Transfer / Direct Deposit Logo
export function BankTransferLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-blue-50 border border-blue-200 text-blue-700 px-1.5 py-0.5 rounded select-none font-bold ${sizeClasses[size]} ${className}`}
      title="Direct Bank Transfer"
    >
      <svg className="w-3.5 h-3.5 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 3l9 7H3z" />
      </svg>
      <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider">Bank Wire</span>
    </div>
  );
}

// 9. Verve Card Logo
export function VerveLogo({ className = '', size = 'sm' }: LogoProps) {
  return (
    <div
      className={`inline-flex items-center justify-center bg-[#00427A] text-white px-1.5 py-0.5 rounded select-none font-extrabold italic ${sizeClasses[size]} ${className}`}
      title="Verve"
    >
      <span className="text-[10px] font-black tracking-tight">verve</span>
    </div>
  );
}

// 10. Paystack Gateway Logo Badge
export function PaystackBrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-lg bg-[#0AA5DB] flex flex-col items-center justify-center p-1 gap-0.5 shrink-0 shadow-xs">
        <div className="w-3.5 h-[2px] bg-white rounded-full" />
        <div className="w-3.5 h-[2px] bg-white/80 rounded-full" />
        <div className="w-3.5 h-[2px] bg-white/60 rounded-full" />
      </div>
      <span className="font-extrabold text-sm tracking-tight text-[#111620]">paystack</span>
    </div>
  );
}

// 11. Pesapal Gateway Logo Badge
export function PesapalBrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-lg bg-linear-to-br from-[#0074E4] to-[#0051A2] flex items-center justify-center text-white shrink-0 shadow-xs font-black text-xs">
        <span className="text-amber-300 font-black">P</span>
      </div>
      <div className="flex items-center tracking-tight text-sm">
        <span className="font-extrabold text-[#0074E4]">pesa</span>
        <span className="font-bold text-[#FF7A00]">pal</span>
      </div>
    </div>
  );
}

// 12. Flutterwave Gateway Logo Badge
export function FlutterwaveBrandLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <div className="w-6 h-6 rounded-lg bg-linear-to-br from-[#FB9129] to-[#F5A623] flex items-center justify-center text-white shrink-0 shadow-xs font-black text-xs">
        <svg className="w-3.5 h-3.5 fill-white" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </div>
      <span className="font-bold text-sm tracking-tight text-[#111620]">Flutterwave</span>
    </div>
  );
}

/**
 * Universal payment badge resolver based on string keyword match.
 * Renders the official brand badge or a stylized fallback badge.
 */
export function PaymentMethodBadge({ name }: { name: string }) {
  const clean = name.toLowerCase();

  if (clean.includes('mpesa') || clean.includes('m-pesa')) {
    return <MpesaLogo />;
  }
  if (clean.includes('airtel')) {
    return <AirtelMoneyLogo />;
  }
  if (clean.includes('tigo')) {
    return <TigoPesaLogo />;
  }
  if (clean.includes('mtn') || clean.includes('momo')) {
    return <MtnMomoLogo />;
  }
  if (clean.includes('visa')) {
    return <VisaLogo />;
  }
  if (clean.includes('mastercard') || clean.includes('master card')) {
    return <MastercardLogo />;
  }
  if (clean.includes('apple')) {
    return <ApplePayLogo />;
  }
  if (clean.includes('verve')) {
    return <VerveLogo />;
  }
  if (clean.includes('bank') || clean.includes('transfer') || clean.includes('wire')) {
    return <BankTransferLogo />;
  }

  // Fallback neat badge
  return (
    <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 border border-gray-200">
      {name}
    </span>
  );
}
