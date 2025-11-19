import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "@radix-ui/react-navigation-menu"
import { Link, useLocation } from "react-router"
import { cn } from "../../lib/utils";

export const CustomMenu = () => {

    const { pathname } = useLocation();

    const isActive = (path: string) => {
        return pathname === path;
    }

    return (
        <NavigationMenu className="py-5">
            <NavigationMenuList className="flex flex-row gap-3 mt-2 mb-3">
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={cn(isActive('/') && "bg-slate-200", "rounded-md p-2")}>
                        <Link to="/">
                            Inicio
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>

                <NavigationMenuItem>
                    <NavigationMenuLink asChild className={cn(isActive('/search') && "bg-slate-200", "rounded-md p-2")}>
                        <Link to="/search">
                            Buscar superhéroes
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu >
    )
}
