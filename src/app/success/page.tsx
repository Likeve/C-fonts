import type { Metadata } from"next";
import { Suspense } from"react";
import SuccessContent from"@/components/SuccessContent";

export const metadata: Metadata = {
  title:"支付成功",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-24">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
