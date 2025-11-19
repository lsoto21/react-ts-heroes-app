import { Outlet } from "react-router"
import { CustomMenu } from "../../components/custom/CustomMenu"

export const HeroesLayout = () => {
    return (
        <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 p-4">
            <div className="max-w-7xl mx-auto">

                <CustomMenu />
                <Outlet />
            </div>
        </div>
    )
}
