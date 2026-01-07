"use client";
import { Button } from "@/components/ui/button";

export default function MultipleChoice({
  tool,
  setSelectedTool,
  updateAnsforQuestion,
  mode,
}: Readonly<{
  tool: any;
  setSelectedTool: any;
  mode: string | undefined;
  updateAnsforQuestion: (
    questionId: number | undefined,
    answer: string | string[]
  ) => void;
}>) {


  const addOption = () => {
    setSelectedTool((prev: any[]) =>
      prev.map(t =>
        t.id === tool.id
          ? {
            ...t,
            options: [
              ...(t.options || []),
              { id: crypto.randomUUID(), value: "" },
            ],
          }
          : t
      )
    );
  };

  const updateOption = (optionId: string, value: string) => {
    setSelectedTool((prev: any[]) =>
      prev.map(t =>
        t.id === tool.id
          ? {
            ...t,
            options: t.options.map((opt: any) =>
              opt.id === optionId ? { ...opt, value } : opt
            ),
          }
          : t
      )
    );
  };

  const updateQuestion = (value: string) => {
    setSelectedTool((prev: any[]) =>
      prev.map(t => (t.id === tool.id ? { ...t, value } : t))
    );
  };



  const handleMultiSelect = (
    optionValue: string,
    checked: boolean
  ) => {
    const prevAnswer: string[] = tool.answer || [];

    const updatedAnswer = checked
      ? [optionValue]
      : prevAnswer.filter(v => v !== optionValue);

    updateAnsforQuestion(tool.qId, updatedAnswer);
  };


  return (
    <div className="flex flex-col gap-4">

      <input
        type="text"
        placeholder="Enter your question"
        className="border-b border-gray-600 p-1 text-sm outline-none"
        value={tool.value || ""}
        onChange={(e) => updateQuestion(e.target.value)}
        disabled={mode === "share"}
      />


      {(tool.options || []).map((option: any, index: number) => (
        <div key={option.id} className="flex items-center gap-2">
          <input
            type="radio"
            disabled={mode !== "share"}
            checked={tool.answer?.includes(option.value) || false}
            onChange={(e) =>
              handleMultiSelect(option.value, e.target.checked)
            }
          />


          <input
            type="text"
            value={option.value}
            placeholder={`Option ${index + 1}`}
            className="p-1 rounded w-full text-sm outline-none"
            onChange={(e) =>
              updateOption(option.id, e.target.value)
            }
            disabled={mode === "share"}
          />
        </div>
      ))}


      {mode !== "share" && (
        <Button
          onClick={addOption}
          className="self-start px-3 py-1 bg-blue-600 text-white text-[10px]"
        >
          + Add Option
        </Button>
      )}
    </div>
  );
}
