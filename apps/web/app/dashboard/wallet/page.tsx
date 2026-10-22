'use client';

import React from 'react';
import Link from 'next/link';
import { Banknote, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button, Card, CardContent } from '@repo/ui';

export default function WalletPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-[#111827]">Earnings & Direct Settlements</h1>
        <p className="text-xs text-gray-500">
          Information regarding client booking settlements on UpBeat Africa.
        </p>
      </div>

      <Card className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <CardContent className="p-8 text-center space-y-5">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <Banknote className="w-8 h-8" />
          </div>

          <div className="max-w-lg mx-auto space-y-2">
            <h2 className="text-lg font-bold text-gray-900">
              100% Direct Artist Payments
            </h2>
            <p className="text-xs text-gray-600 leading-relaxed">
              UpBeat Africa has upgraded to a direct payment model. Performance fees are paid directly to you by the client via Bank Transfer, Mobile Money, or Cash — with 0% platform escrow deductions or gateway fees.
            </p>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 max-w-md mx-auto text-xs text-gray-600 text-left space-y-2">
            <div className="flex items-center gap-2 font-semibold text-gray-900">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>How Settlements Work</span>
            </div>
            <ul className="list-disc pl-5 space-y-1 text-gray-600">
              <li>Configure your preferred Bank and Mobile Money details in Profile.</li>
              <li>When you accept a booking, the client sees your direct payment coordinates.</li>
              <li>You confirm receipt directly once the client transfers the funds.</li>
            </ul>
          </div>

          <div className="pt-2">
            <Link href="/dashboard/profile">
              <Button className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl h-10 px-6 text-xs inline-flex items-center gap-2">
                <span>Manage Direct Payment Instructions</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
