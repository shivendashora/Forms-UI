import { Button } from "@/components/ui/button"

export default function SaveViewer() {

  const Tools = ["Heading", "Input-Question", "Multiplle-Choice-Question"]


  return (
    <div className="h-full flex flex-col bg-gray-700 w-[250px] gap-1">
      {Tools.map((tool: any) => (
        <div key={tool} className="flex flex-col justify-between px-4 py-4 ">
          <Button className="bg-blue-600 text-white w-full h-[60px]" >
            {tool}
          </Button>
        </div>
      ))}

    </div>
  )
}