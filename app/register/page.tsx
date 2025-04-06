"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

const RegisterPage = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleRegister = async(e: React.FormEvent) =>{
        e.preventDefault();
        setError("");

        const response = await fetch("/api/auth/register",{
            method: "POST",
            headers: {"content-type": "application/json"},
            body: JSON.stringify({name, email, password}),
        });

    if (response.ok){
        router.push("/login");
    } else{
        const data = await response.json();
        setError(data.message || "somthing went wrong")
    }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-2xl font-bold mb-4">Register</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label>Name</label>
                        <input type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border rounded" />
                    </div>
                    <div>
                        <label>Email</label>
                        <input type="email"
                                value={email}
                                onChange={(e)=> setEmail(e.target.value)}
                                className="w-full px-3 py-2 border rounded"
                                required />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password"
                               value={password}
                               onChange={(e)=>
                                setPassword(e.target.value)
                               }
                               className="w-full px-3 py-2 border rounded" 
                               required/>
                    </div>
                    <button type="submit"
                            className="w-full bg-blue-500 text-white py-2 rounded">Register</button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;