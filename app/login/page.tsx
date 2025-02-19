"use client"
import { BASE_API_URL } from "@/global"
import { storeCookie } from "@/lib/client-cookie"
import axios from "axios" //library penyambungan databese ke front end
import Image from "next/image"
import { useRouter } from "next/navigation"
import { FormEvent, useState } from "react"
import { ToastContainer, toast } from "react-toastify"

interface loginResponse {
    status: boolean,
    logged: boolean,
    data: {
        id: string,
        name: string,
        email: string,
        role: string,
    },
    message: string,
    token: string
}

const LoginPage = () => {
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const router = useRouter()

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault() // Mencegah halaman refresh
        const url = `${BASE_API_URL}/user/login`
        const payload = JSON.stringify({ email, password })

        try {
            const { data } = await axios.post<loginResponse>(url, payload, {
                headers: { "Content-Type": "application/json" },
            });

            if (data.status === true) {
                // Jika login berhasil
                toast.success(data.message, {
                    hideProgressBar: true,
                    containerId: "toastLogin",
                    autoClose: 2000,
                });

                // Menyimpan data ke cookie
                storeCookie("token", data.token);
                storeCookie("id", data.data.id);
                storeCookie("name", data.data.name);
                storeCookie("role", data.data.role);

                // Navigasi berdasarkan role
                const role = data.data.role;
                if (role === "MANAGER") {
                    setTimeout(() => router.replace(`/manager/dashboard`), 1000);
                } else if (role === "CASHIER") {
                    setTimeout(() => router.replace(`/cashier/dashboard`), 1000);
                }
            } else {
                // Jika login gagal, termasuk email tidak dikenali
                toast.error(data.message || "Email atau password salah.", {
                    hideProgressBar: true,
                    containerId: "toastLogin",
                    autoClose: 2000,
                });
            }
        } catch (error: any) {
            console.error("Error saat login:", error);

            const errorMessage =
                error.response?.data?.message || "Terjadi kesalahan pada server atau jaringan.";
            toast.error(errorMessage, {
                hideProgressBar: true,
                containerId: "toastLogin",
                autoClose: 2000,
            });
        }
    };
    return (
        <div className="w-screen h-screen bg-cover">
            <ToastContainer containerId={`toastLogin`} /> 
            <div className="w-full h-full bg-login bg-cover flex justify-center items-center p-10">
                <div className="w-full md:w-6/12 lg:w-4/12 min-h-[600px] border rounded-xl bg-white bg-opacity-35 backdrop-blur-p-5 flex flex-col items-center relative">
                    <div className="absolute bottom-0 left-0 w-full py-2 text-center">
                        <small className="text-white">Copyright @2024</small>
                    </div>
                    <Image alt="fooder" width={150} height={100} src={`/image/LogoWizzmie.png`} className="h-auto my-10 rounded-xl" />
                    <h4 className="text-2xl uppercase font-semibold text-primary mb-4 text-white">WizzMie</h4>
                    <span className="text-sm text-white font-medium text-center">
                        Selamat Datang
                    </span>
                    <form onSubmit={handleSubmit} className="w-full my-10">
                        <div className="flex w-full my-4">
                            <div className="bg-primary rounded-l-md p-3 bg-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            </div>
                            <input type="text" className="border p-2 grow rounded-r-md focus:outline-none focus:ring-primary focus:border-primmary text-gray-500"
                                value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" id={email} />
                        </div>
                        <div className="flex w-full my-4">
                            <div className="bg-primary rounded-l-md p-3 bg-gray-600">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 
                                    3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 
                                    1 0-7.5 0v3h7.5Z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <input type={showPassword ? "text" : `password`} className="border p-2 grow rounded-r-md focus:outline-none
                                focus:ring-primary focus:border-primary text-gray-500" value={password}
                                onChange={e => setPassword(e.target.value)} placeholder="Password" id={`password-industri-app`} />
                            <div className="cursor-pointer bg-primary rounded-r-md p-3 bg-gray-600" onClick={() => setShowPassword(!showPassword)}>
                                {
                                    showPassword ?
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        </svg> :
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                }
                            </div>
                        </div>
                        <div className="my-10">
                            <button type="submit" className="bg-gray-600 hover:bg-primary uppercase w-full p-2 rounded-md text-white">
                                login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default LoginPage