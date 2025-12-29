'use client'

import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation"
import { FiLogOut } from "react-icons/fi";

export default function Header() {
    const pathname = usePathname()
    const lastRoute = pathname.split("/").at(-1)
    const router = useRouter()


    const handleLogOut = () => {
        localStorage.setItem('UserCredentials', JSON.stringify({
            id: null,
            userName: null,
            accessToken: null
        }))
        router.push('/login')
    }

    const handleCreateForms=()=>{
        router.push('/forms')
    }

    return (
        <div className="w-full h-[56px] bg-gray-800 flex flex-row gap-5 px-4 items-center justify-between">
            <span className="text-[18px] text-white font-semibold uppercase">S Forms</span>
            {lastRoute !== "login" &&
                <div className="flex flex-row gap-3 mr-[25px]">
                    <Button
                        className="text-white bg-red-700  rounded-md p-2 "
                        onClick={handleLogOut}
                    >
                        <FiLogOut size={18} />
                    </Button>
                    {lastRoute === "forms" ? <Button disabled={true} onClick={handleCreateForms} className="bg-gray-600  text-white font-semibold rounded-none text-[10px]">Create Form</Button>:<Button onClick={handleCreateForms} className="bg-gray-600  text-white font-semibold rounded-none text-[10px]">Create Form</Button>}
                    
                </div>
            }

        </div>
    )

}