import { Suspense } from "react";
import FormPageClient from "./FormPageClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading form...</div>}>
      <FormPageClient />
    </Suspense>
  );
}
