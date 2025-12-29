import { FormCanvasProps } from "./types/form-builder";

export default function FormPreview({
  selectedTool,
}: Readonly<Pick<FormCanvasProps, "selectedTool">>) {
  return (
    <div className="bg-white h-[350px] w-full p-4 overflow-y-auto ">
      <h3 className="text-xs font-semibold text-gray-500 mb-3">
        FORM PREVIEW
      </h3>

      <div className="flex flex-col gap-4">
        {selectedTool.map((tool) => (
          <div key={tool.id} className="flex flex-col gap-2">
            {tool.type === "Heading" && (
              <p className="text-sm font-bold text-gray-800">
                Heading
              </p>
            )}

            {tool.type === "Input-Question" && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-700">
                  Enter your question
                </p>
                <div className="h-8 bg-gray-200 rounded" />
              </div>
            )}

            {tool.type === "Multiplle-Choice-Question" && (
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-700">
                  Multiple choice question
                </p>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 border rounded" />
                    <div className="h-2 w-20 bg-gray-200 rounded" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 border rounded" />
                    <div className="h-2 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {selectedTool.length === 0 && (
          <p className="text-xs text-gray-400 italic">
            Add fields to see preview
          </p>
        )}
      </div>
    </div>
  );
}
