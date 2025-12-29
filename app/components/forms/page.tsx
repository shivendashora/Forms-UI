'use client';

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import FormCanvas from "./FormCanvas";
import VerticalOptionViewer from "./VerticalOptionViewer";
import RightViewer from "./Right-Viewer";
import { ToolItem } from "./types/form-builder";

export default function FormPage() {
  const searchParams = useSearchParams();
  const formId = searchParams.get("formId");

  const [selectedTool, setSelectedTool] = useState<ToolItem[]>([]);
  const [saveClicked, setSaveClicked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

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
      const res = await fetch(`http://localhost:3000/forms/${id}`);
      if (!res.ok) throw new Error("Failed to fetch form");

      const data = await res.json();
      const tools = mapApiResponseToTools(data);

      setSelectedTool(tools);
    } catch (err) {
      console.error("Edit fetch error:", err);
    }
  };


  const mapApiResponseToTools = (form: any): ToolItem[] => {
    const tools: ToolItem[] = [];

    // Heading from title
    tools.push({
      id: crypto.randomUUID(),
      type: "Heading",
      value: form.title,
    });

    // Questions
    form.questions.forEach((q: any) => {
      // Text input
      if (q.answerType.id === 2) {
        tools.push({
          id: crypto.randomUUID(),
          type: "Input-Question",
          value: q.question,
        });
      }

      // Multiple choice
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
    <div className="h-[calc(100vh-56px)] flex flex-row bg-gray-800 justify-between overflow-y-hidden">
      
      <div>
        <VerticalOptionViewer setSelectedTool={setSelectedTool} />
      </div>

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


      <div>
        <RightViewer
          selectedTool={selectedTool}
          setSaveClicked={setSaveClicked}
          isSaved={isSaved}
          isEditMode={isEditMode}
        />
      </div>

    </div>
  );
}
