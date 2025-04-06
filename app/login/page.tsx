"use client";

import { useState } from "react";
import {signIn} from "next-auth/react";
import { useRouter} from "next/navigation";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error){
            setError(result.error);
        } else {
            router.push("/dashboard");
        }
    };


return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-2xl font-bold mb-4">Login</h2>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleLogin}className="space-y-4">
                <div>
                    <label className="block">Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required
                     />
                </div>
                <div>
                    <label className="block">Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e)=> setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded"
                        required />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">Login</button>
            </form>
        </div>
    </div>
);
};
export default LoginPage;