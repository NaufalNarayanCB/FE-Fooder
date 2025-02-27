import ManagerTemplate from "@/components/ManagerTemplate"
import MenuList from "../menuList"
import { ToastContainer } from "react-toastify"

export const metadata = {
    title: 'User',
    description: 'Generated by create next app',
}

type PropsLayout = {
    children: React.ReactNode
}

const RootLayout = ({ children }: PropsLayout) => {
    return (
        <ManagerTemplate title="User" id="User"
            menuList={MenuList}>
                <ToastContainer containerId={`toastMenu`} />
            {children}
            <ToastContainer containerId={`toastUser`} />

        </ManagerTemplate>
    )
}

export default RootLayout