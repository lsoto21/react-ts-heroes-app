import { CustomJumbotron } from "../../../components/custom/CustomJumbotron";
import { HeroStats } from "../../components/HeroStats";
import { SearchControls } from "./ui/SearchControls";
import { CustomBreadcrumbs } from "../../../components/custom/CustomBreadcrumbs";
import { HeroGrid } from "../../components/HeroGrid";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { searchHeroesAction } from "../../actions/search-heroes.action";


export const SearchPage = () => {

    const [searchParams] = useSearchParams();

    const name = searchParams.get('name') ?? undefined;
    const strength = searchParams.get('strength') ?? undefined;

    const { data = [] } = useQuery({
        queryKey: ['search', { name, strength }],
        queryFn: () => searchHeroesAction({ name, strength }),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    return (
        <>
            <CustomJumbotron
                title="Búsqueda de SuperHéroes"
                description="Descubre, explora y administra superhéroes y villanos"
            />

            <CustomBreadcrumbs currentPage="Buscador de héroes"
                breadcrumbs={[
                    { label: 'Home1', to: "/1" },
                    { label: 'Home2', to: "/2" },
                    { label: 'Home3', to: "/3" }
                ]}
            />

            <HeroStats />

            <SearchControls />

            <HeroGrid heroes={data} />
        </>
    )
}

export default SearchPage;
