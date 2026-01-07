export interface FormCanvasProps {
  selectedTool: ToolItem[];
  saveClicked?:boolean,
  setSaveClicked:(save:boolean)=>void,
  setIsSaved:(save:boolean) => void,
  formId?:string|null
  setSelectedTool: React.Dispatch<React.SetStateAction<ToolItem[]>>;
  mode?:string
};


export interface MCQOption {
  id: string;
  value: string;
}

export interface ToolItem {
  id: string;
  type: "Heading" | "Input-Question" | "Multiplle-Choice-Question";
  qId?:number;
  value?: string; 
  options?: MCQOption[];
}

