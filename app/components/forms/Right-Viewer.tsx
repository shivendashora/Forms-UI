import { Button } from "@/components/ui/button";
import FormPreview from "./form-preview";
import { useRouter } from "next/navigation";

export default function RightViewer({
  selectedTool,
  setSaveClicked,
  isSaved,
}: any) {
  const options = ["Save", "Close"];
  const router = useRouter()

  const handleSaveAndClose = (option: string) => {
    if (option === "Save" && !isSaved) {
      setSaveClicked(true);
    }

    if(option === "Close"){
      router.push('/dashboard')
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-700 w-[250px] p-4 gap-4">
      <div className="flex justify-center">
        <FormPreview selectedTool={selectedTool} />
      </div>

      <div className="flex gap-2 justify-center">
        {options.map((option) => (
          <Button
            key={option}
            onClick={() => handleSaveAndClose(option)}
            disabled={option === "Save" && isSaved}
            className={`
              px-4 py-2 text-xs rounded
              ${option === "Save" && isSaved
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"}
            `}
          >
            {isSaved && option === "Save" ? "Saved" : option}
          </Button>
        ))}
      </div>

      {isSaved && (
        <p className="text-[10px] text-gray-300 text-center mt-2">
          This form has been saved.  
          To make changes, click <span className="font-semibold">Edit</span> in the dashboard and update the form.
        </p>
      )}
    </div>
  );
}
