"use client";

import { useRouter } from "next/navigation";
import React, { ErrorInfo, useState } from "react"


interface LoginForm {
  username: string;
  email: string;
  password: string;
}

const Login = ()=>{
    const [form, setForm] = useState<LoginForm>({username: "", email: "" ,password: ""});
    const [isLoading, setIsLoading]= useState(false);
    const [error, setError] = useState("");
    const router = useRouter()
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        setError("")
        if ((!form.username && !form.email) || !form.password) {
            setError("Please enter username or email and password");
            return;
        }
        setIsLoading(true);

        const payload: Record<string, string> = {
            password: form.password,
        };

        if (form.username) payload.username = form.username;
        if (form.email) payload.email = form.email;
        
       try {
            const response = await fetch("http://localhost:4000/api/auth/sign-in",
                {
                    method : "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(payload)
                    
                }   
            )
            const data = await response.json();
            if (!response.ok) { 
                setError(
                    data?.message || "Something went wrong. Please try again."
                )
                setIsLoading(false)
                return
            }
            
            localStorage.setItem("token", JSON.stringify(data?.token))
            localStorage.setItem("user", JSON.stringify(data?.user))

            router.push("/dashboard");

       } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
                setError(error.message);
            } else {
                console.log("Unknown error");
                setError("Something went wrong");
            }
       } finally {
            setIsLoading(false);
       }

    }
    
    return (
        <div className="min-h-screen flex justify-center items-center p-5 bg-gray-100">
            
            <form onSubmit={handleSubmit} className="w-full  md:max-w-lg shadow-2xl rounded-2xl px-5">
                {error && <p className="text-sm font-semibold p-2 text-center text-red-500">{error}</p>}
                <fieldset className="border border-cyan-600 flex flex-col gap-2 justify-center p-5 rounded-2xl">
                   <legend className="text-sm font-bold text-gray-700 py-2 border border-cyan-600 rounded-full px-4">Login</legend>
                    <label htmlFor = "username" className="text-sm font-semibold text-gray-700">User Name</label>
                    <input type="text" 
                        id="username" 
                        name="username" 
                        placeholder="Enter your username"
                        value={form.username}
                        onChange={(e)=> setForm({ username: e.target.value, email:"", password: form.password})}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="relative text-center py-5"><hr className="border-cyan-600" /><span className="absolute -top-0.5 left-50 border border-cyan-600 bg-gray-100 p-2 rounded-full">OR</span></div>
                    

                    <label htmlFor="email" className="text-sm font-semibold text-gray-700" >Email</label>
                    <input type="email" 
                        id="email" 
                        name="email" 
                        placeholder="example@.gmail.com"
                        value={form.email}
                        onChange={(e)=> setForm({username:"", email: e.target.value, password: form.password})}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <label htmlFor="password" className="text-sm font-semibold text-gray-700">Password</label>
                    <input type="password" 
                        id="password" 
                        name="password" 
                        placeholder="*********"
                        value={form.password}
                        onChange={(e)=> setForm({...form, password: e.target.value})}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button type="submit" className={`w-full p-2 rounded-md font-bold text-white transition
                        ${isLoading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 cursor-pointer"} `} disabled={isLoading}
                    >
                        {isLoading ? "Submitting..." : "Login"} 
                    </button>
                </fieldset>
                <p className="text-sm text-center font-semibold underline underline-offset-4 p-4">Don&apos;t have an account?{" "} <span onClick={()=>router.push("/sign-up")} className="text-blue-500 hover:text-blue-700 hover:cursor-pointer">Sign-Up</span></p>
            </form>
        </div>
    )
}

export default Login