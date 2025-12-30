"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { fetchWithLoader } from "@/app/utils/fetchWithLoader";


interface LoginResponse {
    id: number;
    userName: string
    message: string;
    accessToken: string
}

export default function LoginPage() {
    const [isRegister, setIsRegister] = useState(false);
    const [password, setPassword] = useState("");
    const [userName, setUserName] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [responseMessage, setResponseMessage] = useState<string | null>(null)
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const router = useRouter()


    const registerUser = async (name: string, userName: string, password: string, email: string) => {
        const payload = {
            name: name,
            userName: userName,
            password: password,
            email: email
        }
        const response = await fetchWithLoader(`${API_URL}/login/register-user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });


    }

    const loginUser = async (userName: string, password: string) => {
        try {
            const payload = {
                username: userName,
                password: password,
            };

            const response = await fetchWithLoader(`${API_URL}/login/login-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });


            const reponseData: LoginResponse = await response.json()
            const message = reponseData.message

            if (!response.ok) {
                setResponseMessage(message)
            }
            const accessToken = reponseData.accessToken
            const id = reponseData.id
            const username = reponseData.userName

            localStorage.setItem('UserCredentials', JSON.stringify({
                id: id,
                userName: username,
                accessToken: accessToken
            }))
            router.push('/dashboard')

        } catch (error) {
            console.error("Error calling login API:", error);
        }
    };


    const handleAuth = () => {
        setErrorMsg("");
        setResponseMessage(null)

        if (isRegister) {
            if (!name || !email || !userName || !password) {
                setErrorMsg("Please fill all the fields to register.");
                return;
            }
            registerUser(name, userName, password, email)
        } else {
            if (!userName || !password) {
                setErrorMsg("Please fill both Username and Password to login.");
                return;
            }
            loginUser(userName, password);
        }
    };

    return (
        <div className="min-h-[calc(100vh-56px)] flex items-center justify-center bg-gray-800">
            <Card className="w-[400px] bg-gray-600 shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-center text-white text-2xl font-semibold">
                        {isRegister ? "Register" : "Login"}
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 p-6">
                    {isRegister && (
                        <>
                            <div className="space-y-1">
                                <Label className="font-medium text-white">Name</Label>
                                <Input
                                    placeholder="Enter your name"
                                    className="border-2 border-gray-300 rounded-md text-black focus:border-blue-700 focus:ring-0"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>

                            <div className="space-y-1">
                                <Label className="font-medium text-white">Email</Label>
                                <Input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="border-2 border-gray-300 rounded-md text-black focus:border-blue-700 focus:ring-0"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    <div className="space-y-1">
                        <Label className="font-medium text-white">Username</Label>
                        <Input
                            placeholder="Enter username"
                            className="border-2 border-gray-300 rounded-md text-black focus:border-blue-700 focus:ring-0"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-1">
                        <Label className="font-medium text-white">Password</Label>
                        <Input
                            type="password"
                            placeholder="Enter password"
                            className="border-2 border-gray-300 rounded-md text-black focus:border-blue-700 focus:ring-0"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

                    <Button
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                        onClick={handleAuth}
                    >
                        {isRegister ? "Register" : "Login"}
                    </Button>
                    {responseMessage && (
                        <p className="text-sm text-red-600 text-center">
                            {responseMessage}
                        </p>
                    )}


                    <p className="text-sm text-center text-white">
                        {isRegister ? "Already have an account?" : "Don’t have an account?"}{" "}
                        <Button
                            className="bg-transparent shadow-none text-white hover:bg-transparent hover:shadow-none  hover:no-underline focus-visible:ring-0"
                            onClick={() => setIsRegister(!isRegister)}
                        >
                            {isRegister ? "Login" : "Register user"}
                        </Button>

                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
