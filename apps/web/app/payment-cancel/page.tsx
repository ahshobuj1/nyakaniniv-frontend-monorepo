import Link from "next/link";
import { XCircle } from "lucide-react";

export default function MainPaymentCancelPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <XCircle className="w-20 h-20 text-red-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Your payment was not completed. If this was a mistake, you can try again.
      </p>
      <Link 
        href="/dashboard"
        className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Return to Dashboard
      </Link>
    </div>
  );
}
