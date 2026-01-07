"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { fetchWithLoader } from "@/app/utils/fetchWithLoader";
import { useRouter } from "next/navigation";

interface FormsTableInterface {
    activeTab: "created" | "filled";
    userId: number | null;
    search: any
}

// Define data types for created and filled forms
interface CreatedFormData {
    id: number;
    formName: string;
    createdAt: string;
    status: string;
    shareAvailable:boolean
}

interface FilledFormData {
    formTitle: string;
    submittedAt: string;
    submittedBy: string;
    status: string;
}

export default function FormsTable({ activeTab, userId, search }: Readonly<FormsTableInterface>) {
    const [createdForms, setCreatedForms] = useState<CreatedFormData[]>([]);
    const [filledForms, setFilledForms] = useState<FilledFormData[]>([]);
    const [allCreatedForms, setAllCreatedForms] = useState<CreatedFormData[]>([]);
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const router = useRouter()


    useEffect(() => {
        if (search === "") {
            setCreatedForms(allCreatedForms);
        } else {
            const filteredForms = allCreatedForms.filter(form =>
                form.formName.toLowerCase().includes(search.toLowerCase())
            );
            setCreatedForms(filteredForms);
        }
    }, [search, allCreatedForms]);


    useEffect(() => {
        if (!userId) return;

        if (activeTab === "created") {
            fetchCreatedForms();
        } else if (activeTab === "filled") {
            fetchFilledForms();
        }
    }, [activeTab, userId]);

    const fetchCreatedForms = async () => {
        if (!userId) return;

        const response = await fetchWithLoader(`${API_URL}/dashboard/get-forms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
        });

        const data = await response.json();
        const mapped: CreatedFormData[] = data.map((form: any) => ({
            id: form.id,
            formName: form.title,
            createdAt: new Date(form.createdAt).toLocaleDateString(),
            status: form.status,
            shareAvailable:form.shareAvailable
        }));

        setAllCreatedForms(mapped); 
        setCreatedForms(mapped);    
    };


    const fetchFilledForms = async () => {
        if (!userId) return;

        const response = await fetchWithLoader(`${API_URL}/dashboard/get-filled-forms`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId }),
        });

        const data = await response.json();
        const mapped: FilledFormData[] = data.map((f: any) => ({
            formTitle: f.formTitle,
            submittedAt: new Date(f.submittedAt).toLocaleDateString(),
            submittedBy: f.submittedBy,
            status: f.status,
        }));

        setFilledForms(mapped);
    };


    const handleShare=(formId:number)=>{
        console.log("Share handled",formId)
    }

    const handleEditButton = (formId: number) => {
        router.push(`/forms?formId=${formId}`);
    }
    const handleDeleteForm = async (formId: number) => {
    try {
        const res = await fetch(`${API_URL}/forms/delete-form/${formId}`, {
            method: "DELETE",
        });
        if (!res.ok) throw new Error("Failed to delete form");
        fetchCreatedForms()
    } catch (err) {
        console.error(err);
    }
};


    return (
        <div className="overflow-x-auto overflow-y-auto overflow-y-auto max-h-[400px] ">
            <Table className="bg-gray-600 ">
                <TableHeader>
                    <TableRow>
                        {activeTab === "created" ? (
                            <>
                                <TableHead className="text-white">Form Name</TableHead>
                                <TableHead className="text-white">Created At</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                                <TableHead className="flex items-center justify-center text-white">Actions</TableHead>
                            </>
                        ) : (
                            <>
                                <TableHead className="text-white">Form Title</TableHead>
                                <TableHead className="text-white" >Submitted At</TableHead>
                                <TableHead className="text-white">Submitted By</TableHead>
                                <TableHead className="text-white">Status</TableHead>
                            </>
                        )}
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {activeTab === "created" && createdForms.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No forms created.
                            </TableCell>
                        </TableRow>
                    )}
                    {activeTab === "filled" && filledForms.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No forms filled.
                            </TableCell>
                        </TableRow>
                    )}

                    {activeTab === "created" &&
                        createdForms.map((form) => (
                            <TableRow key={form.id}>
                                <TableCell className="text-white">{form.formName}</TableCell>
                                <TableCell className="text-white">{form.createdAt}</TableCell>
                                <TableCell className="text-white">{form.status}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 items-center justify-center">
                                        <Button size="sm" variant="outline" className=" text-white cursor-pointer bg-gray-800" onClick={() => handleEditButton(form.id)}>Edit</Button>
                                        <Button size="sm" variant="destructive" className="text-white cursor-pointer bg-gray-800" onClick={()=>handleDeleteForm(form.id)}>Delete</Button>
                                        {
                                            form.shareAvailable && <Button size="sm" variant="outline" className="text-white cursor-pointer bg-gray-800" onClick={()=>handleShare(form.id)}> Share</Button>
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}

                    {activeTab === "filled" &&
                        filledForms.map((form) => (
                            <TableRow key={form.submittedBy}>
                                <TableCell className="text-white">{form.formTitle}</TableCell>
                                <TableCell className="text-white">{form.submittedAt}</TableCell>
                                <TableCell className="text-white">{form.submittedBy}</TableCell>
                                <TableCell>
                                    <span
                                        className={`px-2 py-1 rounded-full text-white text-sm font-semibold ${form.status.toLowerCase() === "submitted" || form.status.toLowerCase() === "active"
                                            ? "bg-green-600"
                                            : "bg-gray-400"
                                            }`}
                                    >
                                        {form.status}
                                    </span>
                                </TableCell>
                            </TableRow>
                        ))}
                </TableBody>
            </Table>
        </div>
    );
}
