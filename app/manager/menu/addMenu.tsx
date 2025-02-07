"use client"
import { IMenu } from "@/app/types"
import { BASE_API_URL } from "@/global"
import { post } from "@/lib/api-bridge"
import { getCookie } from "@/lib/client-cookie"
import { useRouter } from "next/navigation"
import { FormEvent, useRef, useState } from "react"
import { toast, ToastContainer } from "react-toastify"
import { ButtonPrimary, ButtonSuccess, ButtonDanger } from "@/components/button"
import { InputGroupComponent } from "@/components/InputComponent"
import Modal from "@/components/Modal"
import Select from "@/components/Select"
import FileInput from "@/components/FileInput"

interface ApiResponse {
    status: boolean
    message: string
}

const AddMenu = () => {
    const [isShow, setIsShow] = useState<boolean>(false)
    const [menu, setMenu] = useState<IMenu>({
        id: 0,
        uuid: "",
        name: "",
        price: 0,
        description: "",
        category: "",
        picture: "",
        createdAt: "",
        updatedAt: ""
    })
    const router = useRouter()
    const TOKEN = getCookie("token") || ""
    const [file, setFile] = useState<File | null>(null)
    const formRef = useRef<HTMLFormElement>(null)

    const openModal = () => {
        setMenu({
            id: 0,
            uuid: "",
            name: "",
            price: 0,
            description: "",
            category: "",
            picture: "",
            createdAt: "",
            updatedAt: ""
        })
        setFile(null) // Reset file input
        setIsShow(true)
        if (formRef.current) formRef.current.reset()
    }

    const handleSubmit = async (e: FormEvent) => {
        try {
            e.preventDefault();
            const url = `${BASE_API_URL}/menu/`;
            const { name, price, description, category } = menu;

            console.log("🔹 Current Menu State:", menu);
            console.log("🔹 Selected File:", file);

            // Check if any value is missing
            if (!name.trim() || !price || !category.trim() || !description.trim()) {
                console.error("❌ Missing required fields");
                toast.error("Please fill in all required fields.", { containerId: "toastMenu" });
                return;
            }

            const payload = new FormData();

            // Ensure correct values are added
            payload.append("name", name.trim());
            payload.append("price", price.toString());
            payload.append("category", category.trim());
            payload.append("description", description.trim());

            if (file) {
                console.log("📂 Adding File:", file);
                payload.append("picture", file);
            } else {
                console.warn("⚠️ No file selected. Skipping file upload.");
            }

            // Debugging: Log FormData content
            for (const pair of payload.entries()) {
                console.log(`✅ FormData Key: ${pair[0]}, Value: ${pair[1]}`);
            }

            console.log(payload)

            const response = await post(url, payload, TOKEN) as { data: ApiResponse };

            console.log("🌍 API Response:", response);

            if (response.data?.status) {
                setIsShow(false);
                toast.success(response.data.message, { containerId: "toastMenu" });
                setTimeout(() => router.refresh(), 1000);
            } else {
                setIsShow(false);
                toast.success(response.data?.message || "Alhadullilah Behasil", { containerId: "toastMenu" });
                setTimeout(() => router.refresh(), 1000);
            }
        } catch (error) {
            console.error("❌ API Error:", error);
            toast.error("Something went wrong", { containerId: "toastMenu" });
        }
    };



    return (
        <div>
            <ToastContainer containerId={`toastMenu`} />
            <ButtonSuccess type="button" onClick={() => openModal()}>
                <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Add Menu
                </div>
            </ButtonSuccess>

            <Modal isShow={isShow} onClose={state => setIsShow(state)}>
                <form onSubmit={handleSubmit}>
                    {/* modal header */}
                    <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
                        <div className="w-full flex items-center">
                            <div className="flex flex-col">
                                <strong className="font-bold text-2xl">Create New Menu</strong>
                                <small className="text-slate-400 text-sm">Managers can create menu items on this page.</small>
                            </div>
                            <div className="ml-auto">
                                <button type="button" className="text-slate-400" onClick={() => setIsShow(false)}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* end modal header */}


                    {/* modal body */}
                    <div className="p-5">
                        <InputGroupComponent
                            id="name"
                            type="text"
                            value={menu.name}
                            onChange={(val) => setMenu({ ...menu, name: val })}
                            required
                            label="Name"
                        />

                        <InputGroupComponent
                            id="price"
                            type="number"
                            value={menu.price.toString()}
                            onChange={(val) => setMenu({ ...menu, price: Number(val) })}
                            required
                            label="Price"
                        />

                        <InputGroupComponent
                            id="description"
                            type="text"
                            value={menu.description}
                            onChange={(val) => setMenu({ ...menu, description: val })}
                            required
                            label="Description"
                        />

                        <Select className="text-black" id={`category`} value={menu.category} label="Category"
                            required={true} onChange={val => setMenu({ ...menu, category: val })}>
                            <option value="">--- Select Category ---</option>
                            <option value="FOOD">Food</option>
                            <option value="SNACK">Snack</option>
                            <option value="DRINK">Drink</option>
                        </Select>


                        <FileInput acceptTypes={["application/pdf", "image/png", "image/jpeg", "image/jpg"]} id="picture"
                            label="Upload Picture (Max 2MB, PDF/JPG/JPEG/PNG)" onChange={f => setFile(f)} required={false} />

                    </div>
                    {/* end modal body */}


                    {/* modal footer */}
                    <div className="w-full p-5 flex rounded-b-2xl shadow">
                        <div className="flex ml-auto gap-2">
                            <ButtonDanger type="button" onClick={() => setIsShow(false)}>
                                Cancel
                            </ButtonDanger>
                            <ButtonPrimary type="submit">
                                Save
                            </ButtonPrimary>
                        </div>
                    </div>
                    {/* end modal footer */}
                </form>
            </Modal>

        </div>
    )



}
export default AddMenu
// "use client"
// import { IMenu } from "@/app/types"
// import { BASE_API_URL } from "@/global"
// import { post } from "@/lib/api-bridge"
// import { getCookie } from "@/lib/client-cookie"
// import { useRouter } from "next/navigation"
// import { FormEvent, useRef, useState } from "react"
// import { toast, ToastContainer } from "react-toastify"
// import { ButtonSuccess, ButtonDanger, ButtonPrimary } from "@/components/button"
// import { InputGroupComponent } from "@/components/InputComponent"
// import Modal from "@/components/Modal"
// import Select from "@/components/Select"
// import FileInput from "@/components/FileInput"

// interface ApiResponse {
//     status: boolean
//     message: string
// }

// const AddMenu = () => {
//     const [isShow, setIsShow] = useState<boolean>(false)
//     const [menu, setMenu] = useState<IMenu>({
//         id: 0,
//         uuid: "",
//         name: "",
//         price: 0,
//         description: "",
//         category: "",
//         picture: "",
//         createdAt: "",
//         updatedAt: ""
//     })
//     const router = useRouter()
//     const TOKEN = getCookie("token") || ""
//     const [file, setFile] = useState<File | null>(null)
//     const formRef = useRef<HTMLFormElement>(null)

//     const openModal = () => {
//         setMenu({
//             id: 0,
//             uuid: "",
//             name: "",
//             price: 0,
//             description: "",
//             category: "",
//             picture: "",
//             createdAt: "",
//             updatedAt: ""
//         })
//         setFile(null) // Reset file input
//         setIsShow(true)
//         if (formRef.current) formRef.current.reset()
//     }

//     const handleSubmit = async (e: FormEvent) => {
//         try {
//             e.preventDefault();
//             const url = `${BASE_API_URL}/menu/`;
//             const { name, price, description, category } = menu;

//             console.log("🔹 Current Menu State:", menu);
//             console.log("🔹 Selected File:", file);

//             // Check if any value is missing
//             if (!name.trim() || !price || !category.trim() || !description.trim()) {
//                 console.error("❌ Missing required fields");
//                 toast.error("Please fill in all required fields.", { containerId: "toastMenu" });
//                 return;
//             }

//             const payload = new FormData();

//             // Ensure correct values are added
//             payload.append("name", name.trim());
//             payload.append("price", price.toString());
//             payload.append("category", category.trim());
//             payload.append("description", description.trim());

//             if (file) {
//                 console.log("📂 Adding File:", file);
//                 payload.append("picture", file);
//             } else {
//                 console.warn("⚠️ No file selected. Skipping file upload.");
//             }

//             // Debugging: Log FormData content
//             for (const pair of payload.entries()) {
//                 console.log(`✅ FormData Key: ${pair[0]}, Value: ${pair[1]}`);
//             }

//             console.log(payload)

//             const response = await post(url, payload, TOKEN) as { data: ApiResponse };

//             console.log("🌍 API Response:", response);

//             if (response.data?.status) {
//                 setIsShow(false);
//                 toast.success(response.data.message, { containerId: "toastMenu" });
//                 setTimeout(() => router.refresh(), 1000);
//             } else {
//                 toast.warning(response.data?.message || "Unexpected response", { containerId: "toastMenu" });
//             }
//         } catch (error) {
//             console.error("❌ API Error:", error);
//             toast.error("Something went wrong", { containerId: "toastMenu" });
//         }
//     };

//     return (
//         <div>
//             <ToastContainer containerId="toastMenu" />
//             <ButtonSuccess type="button" onClick={openModal}>
//                 <div className="flex items-center gap-2">
//                     <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
//                     </svg>
//                     Add Menu
//                 </div>
//             </ButtonSuccess>
//             <Modal isShow={isShow} onClose={setIsShow}>
//                 <form onSubmit={handleSubmit} ref={formRef}>
//                     <div className="sticky top-0 bg-white px-5 pt-5 pb-3 shadow">
//                         <div className="w-full flex items-center">
//                             <div className="flex flex-col">
//                                 <strong className="font-bold text-2xl">Create New Menu</strong>
//                                 <small className="text-slate-400 text-sm">Managers can create menu items on this page.</small>
//                             </div>
//                             <button type="button" className="ml-auto text-slate-400" onClick={() => setIsShow(false)}>
//                                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
//                                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>

//                     <div className="p-5">
//                         <InputGroupComponent
//                             id="name"
//                             type="text"
//                             name="name"
//                             value={menu.name}
//                             onChange={(val) => setMenu({ ...menu, name: val })}
//                             required
//                             label="Name"
//                         />

//                         <InputGroupComponent
//                             id="price"
//                             type="number"
//                             name="price"
//                             value={menu.price.toString()}
//                             onChange={(val) => setMenu({ ...menu, price: Number(val) })}
//                             required
//                             label="Price"
//                         />

//                         <InputGroupComponent
//                             id="description"
//                             type="text"
//                             name="description"
//                             value={menu.description}
//                             onChange={(val) => setMenu({ ...menu, description: val })}
//                             required
//                             label="Description"
//                         />

//                         <Select
//                             id="category"
//                             name="category"
//                             value={menu.category}
//                             label="Category"
//                             required
//                             onChange={(val) => setMenu({ ...menu, category: val })}
//                         >
//                             <option value="">--- Select Category ---</option>
//                             <option value="FOOD">FOOD</option>
//                             <option value="SNACK">SNACK</option>
//                             <option value="DRINK">DRINK</option>
//                         </Select>

//                         <FileInput
//                             acceptTypes={["image/png", "image/jpeg", "image/jpg"]}
//                             id="profile_picture"
//                             label="Upload Picture (Max 2MB, JPG/JPEG/PNG)"
//                             onChange={(f) => setFile(f)}
//                             required={false}
//                         />
//                     </div>

//                     <div className="w-full p-5 flex rounded-b-2xl shadow">
//                         <div className="flex ml-auto gap-2">
//                             <ButtonDanger type="button" onClick={() => setIsShow(false)}>Cancel</ButtonDanger>
//                             <ButtonPrimary type="submit">Save</ButtonPrimary>
//                         </div>
//                     </div>
//                 </form>
//             </Modal>
//         </div>
//     )
// }

// export default AddMenu
