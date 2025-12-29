import { Button } from "@/components/ui/button"




export default function VerticalOptionViewer({ setSelectedTool }: any) {

  const Tools = [
    { id: "1", type: "Heading" },
    { id: "2", type: "Input-Question" },
    { id: "3", type: "Multiplle-Choice-Question" }
  ]


  return (
    <div className="h-full flex flex-col bg-gray-700 w-[250px] gap-1">
      {Tools.map((tool: any) => (
        <div key={tool.id} className="flex flex-col justify-between px-4 py-4 ">
          <Button
            className="bg-blue-600 text-white w-full h-[60px]"
            onClick={() =>
              setSelectedTool((prev: any) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  type: tool.type,
                },
              ])
            }
          >
            {tool.type}
          </Button>
        </div>
      ))}

    </div>
  )
}