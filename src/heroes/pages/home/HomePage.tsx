import { use, useMemo } from "react"

import { Tabs, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { CustomJumbotron } from "../../../components/custom/CustomJumbotron"
import { HeroStats } from "../../components/HeroStats"
import { SearchControls } from "../search/ui/SearchControls"
import { HeroGrid } from "../../components/HeroGrid"
import { TabsContent } from "@radix-ui/react-tabs"
import { CustomPagination } from "../../../components/custom/CustomPagination"
import { CustomBreadcrumbs } from "../../../components/custom/CustomBreadcrumbs"
import type { Hero } from "../../types/hero.interface"
import { useSearchParams } from "react-router"
import { useQuery } from "@tanstack/react-query"
import { useHeroSummary } from "../../hooks/useHeroSummary"
import { getHeroesByPage } from "../../actions/get-heroes-by-page.action"
import { searchHeroesAction } from "../../actions/search-heroes.action"
import { FavoriteHeroContext } from "../../context/FavoriteHeroContext"


export const HomePage = () => {

    const { favoriteCount, favorites } = use(FavoriteHeroContext);

    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') ?? 'all';
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '6';
    const category = searchParams.get('category') ?? 'all';

    // Search & advanced filter params
    const searchName = searchParams.get('name') ?? undefined;
    const filterTeam = searchParams.get('team') ?? undefined;
    const filterUniverse = searchParams.get('universe') ?? undefined;
    const filterStatus = searchParams.get('status') ?? undefined;
    const filterStrength = searchParams.get('strength') ?? undefined;

    // Determine if we should use search endpoint or paginated endpoint
    const hasSearchOrAdvancedFilters = !!(
        searchName ||
        filterTeam ||
        filterUniverse ||
        filterStatus ||
        (filterStrength && Number(filterStrength) > 0)
    );

    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains'];
        return validTabs.includes(activeTab) ? activeTab : 'all';
    }, [activeTab]);

    const { data: summary } = useHeroSummary();

    // Use search endpoint when there's text search or advanced filters
    const { data: searchResults } = useQuery({
        queryKey: ['home-search', { name: searchName, team: filterTeam, category: selectedTab === 'heroes' ? 'Hero' : selectedTab === 'villains' ? 'Villain' : undefined, universe: filterUniverse, status: filterStatus, strength: filterStrength }],
        queryFn: () => searchHeroesAction({
            name: searchName,
            team: filterTeam,
            category: selectedTab === 'heroes' ? 'Hero' : selectedTab === 'villains' ? 'Villain' : undefined,
            universe: filterUniverse,
            status: filterStatus,
            strength: filterStrength,
        }),
        staleTime: 1000 * 60 * 5,
        enabled: hasSearchOrAdvancedFilters || selectedTab === 'all',
    });

    // Use paginated endpoint for tab-only filtering (no search/advanced filters)
    const { data: heroesResponse } = useQuery({
        queryKey: ['heroes', { page: page, limit: limit, category: selectedTab === 'all' ? 'all' : (selectedTab === 'heroes' ? 'Hero' : selectedTab === 'villains' ? 'Villain' : category) }],
        queryFn: () => getHeroesByPage(
            +page,
            +limit,
            selectedTab === 'all' ? 'all' : (selectedTab === 'heroes' ? 'Hero' : selectedTab === 'villains' ? 'Villain' : category)
        ),
        staleTime: 1000 * 60 * 5,
        enabled: !hasSearchOrAdvancedFilters && selectedTab !== 'favorites',
    });

    return (
        <>
            <CustomJumbotron
                title="Universo de Superhéroes"
                description="Descubre, explora y administra superhéroes y villanos"
            />

            <CustomBreadcrumbs currentPage="Superhéroes" />

            {/* Stats Dashboard */}
            <HeroStats />

            {/* Controls */}
            <SearchControls />


            {/* Tabs */}
            <Tabs value={selectedTab} className="mb-8">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="all"
                        onClick={() => setSearchParams((prev) => {
                            prev.set('tab', 'all');
                            prev.set('category', 'all');
                            prev.set('page', '1');
                            return prev;
                        })}
                    >
                        Todos los personajes ({summary?.totalHeroes})
                    </TabsTrigger>
                    <TabsTrigger value="favorites" className="flex items-center gap-2"
                        onClick={() => setSearchParams((prev) => {
                            prev.set('tab', 'favorites')
                            return prev;
                        })}
                    >
                        Favoritos ({favoriteCount})
                    </TabsTrigger>
                    <TabsTrigger value="heroes"
                        onClick={() => setSearchParams((prev) => {
                            prev.set('tab', 'heroes');
                            prev.set('category', 'hero');
                            prev.set('page', '1');
                            return prev;
                        })}
                    >
                        Héroes ({summary?.heroCount})
                    </TabsTrigger>
                    <TabsTrigger value="villains"
                        onClick={() => setSearchParams((prev) => {
                            prev.set('tab', 'villains');
                            prev.set('category', 'villain');
                            prev.set('page', '1');
                            return prev;
                        })}
                    >
                        Villanos ({summary?.villainCount})
                    </TabsTrigger>
                </TabsList>
                <TabsContent value='all'>
                    {hasSearchOrAdvancedFilters ? (
                        <HeroGrid heroes={searchResults as Hero[] ?? []} />
                    ) : (
                        <HeroGrid heroes={heroesResponse?.heroes as Hero[] ?? []} />
                    )}
                </TabsContent>
                <TabsContent value='favorites'>
                    <HeroGrid heroes={favorites} />
                </TabsContent>
                <TabsContent value='heroes'>
                    {hasSearchOrAdvancedFilters ? (
                        <HeroGrid heroes={searchResults as Hero[] ?? []} />
                    ) : (
                        <HeroGrid heroes={heroesResponse?.heroes as Hero[] ?? []} />
                    )}
                </TabsContent>
                <TabsContent value='villains'>
                    {hasSearchOrAdvancedFilters ? (
                        <HeroGrid heroes={searchResults as Hero[] ?? []} />
                    ) : (
                        <HeroGrid heroes={heroesResponse?.heroes as Hero[] ?? []} />
                    )}
                </TabsContent>
            </Tabs>



            {/* Pagination - only when using paginated endpoint (no search/advanced filters) */}
            {
                selectedTab !== 'favorites' && !hasSearchOrAdvancedFilters && (
                    <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
                )
            }
        </>
    )
}

export default HomePage;