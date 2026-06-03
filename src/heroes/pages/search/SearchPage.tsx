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
    const team = searchParams.get('team') ?? undefined;
    const category = searchParams.get('category') ?? undefined;
    const universe = searchParams.get('universe') ?? undefined;
    const status = searchParams.get('status') ?? undefined;
    const strength = searchParams.get('strength') ?? undefined;

    const { data = [] } = useQuery({
        queryKey: ['search', { name, team, category, universe, status, strength }],
        queryFn: () => searchHeroesAction({ name, team, category, universe, status, strength }),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });

    return (
        <>
            <CustomJumbotron
                title="Búsqueda de SuperHéroes"
                description="Descubre, explora y administra superhéroes y villanos"
            />

            <CustomBreadcrumbs currentPage="Buscador de héroes" />

            <HeroStats />

            <SearchControls />

            <HeroGrid heroes={data} />
        </>
    )
}

export default SearchPage;
