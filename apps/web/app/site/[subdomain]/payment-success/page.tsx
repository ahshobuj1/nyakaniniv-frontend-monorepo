import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function TenantPaymentSuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-gray-600 mb-8 max-w-md">
        Thank you! Your payment has been received successfully. The DJ will be notified of your booking.
      </p>
      <Link 
        href="/"
        className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
      >
        Return to DJ Profile
      </Link>
    </div>
  );
}
