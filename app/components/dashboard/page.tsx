'use client'

import { useEffect, useState } from "react"
import SearchBar from "./searchbar"
import FormsTable from "./formstable"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {

    const [userName, setUserName] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState<"created" | "filled">("created");
    const [search, setSearch] = useState("");
    const[userId,setUserId] = useState<number|null>(null);

    useEffect(() => {
        userData()
    }, [])

    const userData = () => {
        const userCredentials = localStorage.getItem("UserCredentials");
        if (!userCredentials) return;

        const user = JSON.parse(userCredentials);
        setUserName(user.userName)
        console.log("userid consoled",user.id)
        setUserId(Number(user.id))
    };

    return (
        <div className="min-h-[calc(100vh-56px)] flex flex-col gap-6 bg-gray-800 px-6">
            <div className="flex flex-col gap-1 mt-6 w-full flex items-center justify-center">
                <span className="text-2xl text-white font-semibold ">Welcome {userName}</span>
                <span className="text-[17px] font-normal text-white">Here are the created foms lists...</span>
            </div>

            <div>
                <SearchBar setSearch={setSearch} search={search} />
            </div>

            <div>
                <Button
                    variant="ghost"
                    className={`rounded-none font-semibold border-b-2 focus-visible:ring-0
                    ${activeTab === "created"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-white"}
                            hover:bg-transparent hover:text-blue-600`}
                    onClick={() => setActiveTab("created")}
                >
                    Forms Created
                </Button>

                <Button
                    variant="ghost"
                    className={`rounded-none font-semibold border-b-2 focus-visible:ring-0
                    ${activeTab === "filled"
                            ? "border-blue-600 text-blue-600"
                            : "border-transparent text-white"}
                            hover:bg-transparent hover:text-blue-600`}
                    onClick={() => setActiveTab("filled")}
                >
                    Forms Filled
                </Button>
            </div>
            <div>
                <FormsTable activeTab={activeTab} userId={userId} search={search} />
            </div>
        </div>
    )
}