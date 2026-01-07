"use client";

import { usePathname } from "next/navigation";
import FormPageClient from "@/app/components/forms/FormPageClient";

export default function Page() {
  const pathname = usePathname();
  const formId = pathname.split("/").pop(); 

  console.log("FormId from share page",formId)

  if (!formId) return null;

  return <FormPageClient sharedFormId={String(formId)} mode="share" />;
}
