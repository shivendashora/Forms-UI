'use client';
import { Button } from "@/components/ui/button";

export default function MultipleChoice({
  tool,
  setSelectedTool,
}: Readonly<{
  tool: any;
  setSelectedTool: any;
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

const updateSingleOption = (opt: any, optionId: string, value: string) => {
  if (opt.id !== optionId) return opt;
  return { ...opt, value };
};

const updateToolOptions = (toolItem: any, optionId: string, value: string) => {
  const options = toolItem.options || [];
  const updatedOptions: any[] = [];

  for (const element of options) {
    updatedOptions.push(updateSingleOption(element, optionId, value));
  }

  return { ...toolItem, options: updatedOptions };
};

const updateOption = (optionId: string, value: string) => {
  const prevTools = [...tool]; 
  const updatedTools: any[] = [];

  for (const element of prevTools) {
    const t = element;
    if (t.id === tool.id) {
      updatedTools.push(updateToolOptions(t, optionId, value));
    } else {
      updatedTools.push(t);
    }
  }

  setSelectedTool(updatedTools);
};




  const updateQuestion = (value: string) => {
    setSelectedTool((prev: any[]) =>
      prev.map(t =>
        t.id === tool.id ? { ...t, value } : t
      )
    );
  };

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter your question"
        className="border-b border-gray-600 p-1 text-sm outline-none"
        value={tool.value || ""}
        onChange={(e) => updateQuestion(e.target.value)}
      />

      {(tool.options || []).map((option: any, index: number) => (
        <div key={option.id} className="flex items-center gap-2">
          <input type="checkbox" disabled />
          <input
            type="text"
            value={option.value}
            placeholder={`Option ${index + 1}`}
            className="p-1 rounded w-full text-sm outline-none"
            onChange={(e) =>
              updateOption(option.id, e.target.value)
            }
          />
        </div>
      ))}

      <Button
        onClick={addOption}
        className="self-start px-3 py-1 bg-blue-600 text-white text-[10px]"
      >
        + Add Option
      </Button>
    </div>
  );
}
