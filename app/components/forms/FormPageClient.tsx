"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormCanvas from "./FormCanvas";
import VerticalOptionViewer from "./VerticalOptionViewer";
import RightViewer from "./Right-Viewer";
import { ToolItem } from "./types/form-builder";
import { fetchWithLoader } from "@/app/utils/fetchWithLoader";

interface FormClient {
  sharedFormId?: string;
  mode?: string;
}

export default function FormPageClient({
  sharedFormId,
  mode,
}: Readonly<FormClient>) {

  const searchParams = useSearchParams();
  const queryFormId = searchParams.get("formId");
  console.log("sharedFormId",sharedFormId)

  const resolvedFormId = queryFormId ?? sharedFormId ?? null;

  const isSharing = mode === "share";

  const [selectedTool, setSelectedTool] = useState<ToolItem[]>([]);
  const [saveClicked, setSaveClicked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(()=>{
    console.log("Selected Tools",selectedTool)
    console.log("Resolved formId",resolvedFormId)
  })

  useEffect(() => {
    if (!resolvedFormId) {
      setIsEditMode(false);
      setSelectedTool([]);
      return;
    }

    const numericId = Number(resolvedFormId);
    if (Number.isNaN(numericId)) return;

    setIsEditMode(true);
    fetchFormForEdit(numericId);
  }, [resolvedFormId]);

  useEffect(() => {
    setIsSaved(false);
  }, [selectedTool]);

  const fetchFormForEdit = async (id: number) => {
    try {
      console.log("Fetching form with ID:", id);

      const res = await fetchWithLoader(`${API_URL}/forms/${id}`);
      if (!res.ok) throw new Error("Failed to fetch form");

      const data = await res.json();
      console.log("Data fetched:", data);

      setSelectedTool(mapApiResponseToTools(data));
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };

  const mapApiResponseToTools = (form: any): ToolItem[] => {
    const tools: ToolItem[] = [];

    tools.push({
      id: crypto.randomUUID(),
      type: "Heading",
      value: form.title,
    });

    form.questions.forEach((q: any) => {
      if (q.answerType.id === 2) {
        tools.push({
          id: crypto.randomUUID(),
          type: "Input-Question",
          qId:q.id,
          value: q.question,
        });
      }

      if (q.answerType.id === 1) {
        tools.push({
          id: crypto.randomUUID(),
          type: "Multiplle-Choice-Question",
          value: q.question,
          qId:q.id,
          options: q.options.map((opt: any) => ({
            id: crypto.randomUUID(),
            value: opt.value,
          })),
        });
      }
    });

    return tools;
  };

  return (
    <div className="h-[calc(100vh-56px)] flex bg-gray-800 justify-between overflow-y-hidden">
      {!isSharing && (
        <VerticalOptionViewer setSelectedTool={setSelectedTool} />
      )}

      <div className="pt-[20px] flex flex-1 justify-center items-center">
        <FormCanvas
          formId={resolvedFormId ? String(resolvedFormId) : ""}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          saveClicked={saveClicked}
          setSaveClicked={setSaveClicked}
          setIsSaved={setIsSaved}
          mode={mode}
        />
      </div>

      {!isSharing && (
        <RightViewer
          selectedTool={selectedTool}
          setSaveClicked={setSaveClicked}
          isSaved={isSaved}
          isEditMode={isEditMode}
        />
      )}
    </div>
  );
}
