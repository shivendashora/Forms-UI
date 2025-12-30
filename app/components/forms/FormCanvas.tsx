'use client'
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import MultipleChoice from "./MultipleChoice";
import { FormCanvasProps } from "./types/form-builder";
import { Trash2 } from "lucide-react";
import { fetchWithLoader } from "@/app/utils/fetchWithLoader";

export default function FormCanvas({
    selectedTool,
    setSelectedTool,
    setSaveClicked,
    saveClicked,
    setIsSaved,
    formId
}: Readonly<FormCanvasProps>) {
    const [userId, setUserId] = useState<number | null>(null);
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    const removeTool = (id: string) => {
        setSelectedTool(prev => prev.filter(tool => tool.id !== id));
    };

    // Get user ID
    useEffect(() => {
        const userCredentials = localStorage.getItem("UserCredentials");
        if (!userCredentials) return;
        const user = JSON.parse(userCredentials);
        setUserId(Number(user.id));
    }, []);

    const generateSavePayload = async () => {
        if (!saveClicked) return;
        if (!userId) return;
        if (!selectedTool.length) return;

        const headingTool = selectedTool.find(
            (tool) => tool.type === "Heading" && tool.value?.trim()
        );

        const title = headingTool?.value?.trim() || "Untitled Form";

        const questions = selectedTool
            .filter(
                (tool) =>
                    tool.type === "Input-Question" ||
                    tool.type === "Multiplle-Choice-Question"
            )
            .map((tool, index) => {
                if (tool.type === "Input-Question") {
                    return {
                        question: tool.value || "",
                        order: index + 1,
                        answerTypeId: 2,
                        options: [],
                    };
                }

                if (tool.type === "Multiplle-Choice-Question") {
                    return {
                        question: tool.value || "",
                        order: index + 1,
                        answerTypeId: 1,
                        options:
                            tool.options?.map((opt, optIndex) => ({
                                value: opt.value,
                                order: optIndex + 1,
                            })) || [],
                    };
                }

                return null;
            })
            .filter(Boolean);

        const payload = {
            formId: Number(formId) || undefined,
            title,
            status: "active",
            createdById: userId,
            questions,
        };

        console.log("SAVE/UPDATE PAYLOAD:", payload);

        try {
            const res = await fetchWithLoader(`${API_URL}/forms/save`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Save failed");

            await res.json();
            setIsSaved(true);
            setSaveClicked(false);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        generateSavePayload();
    }, [saveClicked]);

    const updateToolValue = (toolId: string, value: string) => {
        setSelectedTool(prevTools => {
            const updatedTools = prevTools.map(t => {
                if (t.id === toolId) {
                    return { ...t, value };
                }
                return t;
            });
            return updatedTools;
        });
    };


    return (
        <div className="h-[calc(100vh-56px)] bg-white w-[40vw] overflow-y-auto p-6 flex flex-col gap-4">
            {selectedTool.map((tool) => (
                <div
                    key={tool.id}
                    className="relative rounded p-4 group"
                >
                    <Button
                        type="button"
                        onClick={() => removeTool(tool.id)}
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-2 opacity-0 group-hover:opacity-10 transition text-gray-500 hover:text-red-500 hover:bg-transparent flex items-center justify-center "
                    >
                        <Trash2 size={18} />
                    </Button>

                    {tool.type === "Heading" && (
                        <input
                            className="text-sm font-bold text-gray-800 border-b border-gray-600 outline-none w-full"
                            placeholder="Heading"
                            value={tool.value || ""}
                            onChange={(e) => updateToolValue(tool.id, e.target.value)}
                        />
                    )}

                    {tool.type === "Input-Question" && (
                        <div className="flex flex-col gap-4 text-sm">
                            <input
                                type="text"
                                placeholder="Enter your question"
                                className="border-b border-gray-600 p-1 rounded text-sm outline-none"
                                value={tool.value || ""}
                                onChange={(e) => updateToolValue(tool.id, e.target.value)}
                            />
                            <textarea
                                placeholder="Answer will go here"
                                className="text-sm rounded bg-gray-100 h-[180px]"
                                disabled
                            />
                        </div>
                    )}


                    {tool.type === "Multiplle-Choice-Question" && (
                        <MultipleChoice
                            tool={tool}
                            setSelectedTool={setSelectedTool}
                        />
                    )}
                </div>
            ))}
        </div>
    );
}
