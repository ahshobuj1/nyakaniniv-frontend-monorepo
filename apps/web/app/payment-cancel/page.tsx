import Link from "next/link";
import Image from "next/image";
import { XCircle, ArrowLeft, Home } from "lucide-react";

export default function MainPaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDFD] via-[#F8FAFC] to-[#F1F5F9] text-[#111620] py-12 px-4 sm:px-6 relative overflow-hidden font-sans flex flex-col items-center justify-center">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/[0.07] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full mx-auto space-y-6 relative z-10 text-center">
        {/* Navigation Bar */}
        <header className="bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl px-5 py-3 shadow-xs flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/auth.logo.png"
              alt="UpBeat Africa"
              width={115}
              height={32}
              className="h-6 w-auto object-contain"
            />
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-primary transition-colors px-2 py-1"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Home</span>
          </Link>
        </header>

        {/* Card */}
        <div className="rounded-3xl bg-white border border-gray-200/90 p-8 sm:p-10 shadow-xl space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-red-50 text-primary border border-red-100 flex items-center justify-center mx-auto shadow-xs">
            <XCircle className="w-9 h-9" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-[#111620]">
              Payment Cancelled
            </h1>
            <p className="text-gray-600 text-xs sm:text-sm max-w-sm mx-auto leading-relaxed">
              Your transaction was not completed. No charges were made to your account. You can return or retry anytime.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link 
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 bg-primary hover:bg-[#d62828] text-white font-bold text-xs rounded-xl shadow-lg shadow-primary/25 transition-all"
            >
              <Home className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>

            <Link 
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-6 bg-white border border-gray-300 hover:bg-gray-50 text-[#111620] font-bold text-xs rounded-xl shadow-2xs transition-colors"
            >
              <span>Dashboard</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
