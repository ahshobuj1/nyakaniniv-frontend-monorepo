import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ShieldCheck, ExternalLink, Home } from "lucide-react";

export default async function TenantPaymentSuccessPage({
  params,
}: {
  params?: Promise<{ subdomain?: string }>;
}) {
  const resolvedParams = params ? await params : undefined;
  const subdomain = resolvedParams?.subdomain;

  const getDjProfileUrl = () => {
    if (!subdomain) return "/";
    return `/site/${subdomain}`;
  };

  const getMainAppUrl = () => {
    if (typeof process !== "undefined" && process.env.NEXT_PUBLIC_APP_URL) {
      return process.env.NEXT_PUBLIC_APP_URL;
    }
    return "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDFD] via-[#F8FAFC] to-[#F1F5F9] text-[#111620] py-12 px-4 sm:px-6 relative overflow-hidden font-sans flex flex-col items-center justify-center">
      {/* Dynamic ambient glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/[0.07] rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/[0.06] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-xl w-full mx-auto space-y-6 relative z-10">
        {/* Navigation Bar */}
        <header className="bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl px-5 py-3 shadow-xs flex items-center justify-between">
          <Link href={getMainAppUrl()} className="flex items-center gap-2">
            <Image
              src="/auth.logo.png"
              alt="UpBeat Africa"
              width={115}
              height={32}
              className="h-6 w-auto object-contain"
            />
          </Link>

          <Link
            href={getMainAppUrl()}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors px-2 py-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>UpBeat Home</span>
          </Link>
        </header>

        {/* Success Card */}
        <div className="rounded-3xl bg-white border border-emerald-200/90 p-8 sm:p-10 shadow-xl relative overflow-hidden text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Escrow Protected • Secured
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-[#111620]">
              Payment Successful!
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Your payment has been received and locked safely in Escrow. The DJ has been notified and your date is officially reserved.
            </p>
          </div>

          {/* Ticket styling card */}
          <div className="rounded-2xl bg-gray-50/80 border border-gray-200/80 p-5 text-left text-xs space-y-2.5">
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-semibold text-[11px] uppercase tracking-wider">Status</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">Paid & Confirmed</span>
            </div>
            <div className="flex justify-between items-center text-gray-600">
              <span className="font-semibold text-[11px] uppercase tracking-wider">Escrow Guarantee</span>
              <span className="font-bold text-[#111620]">100% Protected until gig ends</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href={getDjProfileUrl()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-primary hover:bg-[#d62828] text-white font-bold text-sm shadow-lg shadow-primary/25 transition-all cursor-pointer"
            >
              <span>Return to DJ Profile</span>
              <ExternalLink className="w-4 h-4" />
            </Link>

            <Link
              href={getMainAppUrl()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-7 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 text-[#111620] font-bold text-sm shadow-2xs transition-colors"
            >
              <Home className="w-4 h-4 text-gray-500" />
              <span>UpBeat Africa Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
