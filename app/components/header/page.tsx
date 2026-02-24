'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { FiLogOut } from "react-icons/fi";
import { useSaveStore } from "@/app/store/saveState";
import ShareDialog from "@/app/components/share/ShareDialog";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const setSaveState = useSaveStore((state)=>state.setSaveState)
    const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
    const lastRoute = pathname.split("/").at(-1);
    const secondLastRoute = pathname.split("/").at(-2);

    const isShareMode = secondLastRoute === "share";
    const isLoginPage = lastRoute === "login";

    // Get the form ID from the URL path (for share mode)
    const formId = isShareMode ? lastRoute : null;

    const handleLogOut = () => {
        localStorage.setItem(
            "UserCredentials",
            JSON.stringify({
                id: null,
                userName: null,
                accessToken: null,
            })
        );
        router.push("/login");
    };

    const handleCreateForms = () => {
        router.push("/forms");
    };

    const handleSaveShareForm = () => {
        setSaveState(true)
    };

    const handleShareClick = () => {
        setIsShareDialogOpen(true);
    };

    return (
        <>
            <div className="w-full h-[56px] bg-gray-800 flex flex-row gap-5 px-4 items-center justify-between">
                <span className="text-[18px] text-white font-semibold uppercase">
                    S Forms
                </span>

                {!isLoginPage && (
                    <div className="flex flex-row gap-3 mr-[25px]">
                        <Button
                            className="text-white bg-red-700 rounded-md p-2"
                            onClick={handleLogOut}
                            disabled={isShareMode}
                        >
                            <FiLogOut size={18} />
                        </Button>

                        {isShareMode ? (
                            <div className="flex gap-2">
                                <Button
                                    onClick={handleShareClick}
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold rounded-none text-[10px]"
                                >
                                    Share
                                </Button>
                                <Button
                                    onClick={handleSaveShareForm}
                                    className="bg-gray-600 text-white font-semibold rounded-none text-[10px]"
                                >
                                    Save
                                </Button>
                            </div>

                        ) : (
                            <Button
                                onClick={handleCreateForms}
                                disabled={lastRoute === "forms"}
                                className="bg-gray-600 text-white font-semibold rounded-none text-[10px]"
                            >
                                Create Form
                            </Button>
                        )}
                    </div>
                )}
            </div>

            {/* Share Dialog */}
            <ShareDialog
                open={isShareDialogOpen}
                onOpenChange={setIsShareDialogOpen}
                formId={formId}
            />
        </>
    );
}
