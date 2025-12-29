"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormCanvas from "./FormCanvas";
import VerticalOptionViewer from "./VerticalOptionViewer";
import RightViewer from "./Right-Viewer";
import { ToolItem } from "./types/form-builder";

export default function FormPageClient() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const [selectedTool, setSelectedTool] = useState<ToolItem[]>([]);
  const [saveClicked, setSaveClicked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    if (formId) {
      setIsEditMode(true);
      fetchFormForEdit(Number(formId));
    } else {
      setIsEditMode(false);
      setSelectedTool([]);
    }
  }, [formId]);

  useEffect(() => {
    setIsSaved(false);
  }, [selectedTool]);

  const fetchFormForEdit = async (id: number) => {
    try {
      const res = await fetch(`${API_URL}/forms/${id}`);
      if (!res.ok) throw new Error("Failed to fetch form");

      const data = await res.json();
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
          value: q.question,
        });
      }

      if (q.answerType.id === 1) {
        tools.push({
          id: crypto.randomUUID(),
          type: "Multiplle-Choice-Question",
          value: q.question,
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
      <VerticalOptionViewer setSelectedTool={setSelectedTool} />

      <div className="pt-[20px]">
        <FormCanvas
          formId={formId}
          selectedTool={selectedTool}
          setSelectedTool={setSelectedTool}
          saveClicked={saveClicked}
          setSaveClicked={setSaveClicked}
          setIsSaved={setIsSaved}
        />
      </div>

      <RightViewer
        selectedTool={selectedTool}
        setSaveClicked={setSaveClicked}
        isSaved={isSaved}
        isEditMode={isEditMode}
      />
    </div>
  );
}
