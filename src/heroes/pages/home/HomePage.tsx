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
import { useHeroSummary } from "../../hooks/useHeroSummary"
import { usePaginatedHero } from "../../hooks/usePaginatedHero"
import { FavoriteHeroContext } from "../../context/FavoriteHeroContext"


export const HomePage = () => {

    const { favoriteCount, favorites } = use(FavoriteHeroContext);

    const [searchParams, setSearchParams] = useSearchParams();

    const activeTab = searchParams.get('tab') ?? 'all';
    const page = searchParams.get('page') ?? '1';
    const limit = searchParams.get('limit') ?? '6';
    const category = searchParams.get('category') ?? 'all';

    const selectedTab = useMemo(() => {
        const validTabs = ['all', 'favorites', 'heroes', 'villains'];
        return validTabs.includes(activeTab) ? activeTab : 'all';
    }, [activeTab]);

    // const [activeTab, setActiveTab] = useState<tabs>('all');

    const { data: heroesResponse } = usePaginatedHero(page, limit, category);

    const { data: summary } = useHeroSummary();

    return (
        <>
            <>
                {/* Header */}
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
                            All Characters ({summary?.totalHeroes})
                        </TabsTrigger>
                        <TabsTrigger value="favorites" className="flex items-center gap-2"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'favorites')
                                return prev;
                            })}
                        >
                            Favorites ({favoriteCount})
                        </TabsTrigger>
                        <TabsTrigger value="heroes"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'heroes');
                                prev.set('category', 'hero');
                                prev.set('page', '1');
                                return prev;
                            })}
                        >
                            Heroes ({summary?.heroCount})
                        </TabsTrigger>
                        <TabsTrigger value="villains"
                            onClick={() => setSearchParams((prev) => {
                                prev.set('tab', 'villains');
                                prev.set('category', 'villain');
                                prev.set('page', '1');
                                return prev;
                            })}
                        >
                            Villains ({summary?.villainCount})
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value='all'>
                        <HeroGrid heroes={heroesResponse?.heroes as Hero[] ?? []} />
                    </TabsContent>
                    <TabsContent value='favorites'>
                        <HeroGrid heroes={favorites} />
                    </TabsContent>
                    <TabsContent value='heroes'>
                        <HeroGrid heroes={heroesResponse?.heroes as Hero[] ?? []} />
                    </TabsContent>
                    <TabsContent value='villains'>
                        <HeroGrid heroes={heroesResponse?.heroes as Hero[] ?? []} />
                    </TabsContent>
                </Tabs>



                {/* Pagination */}
                {
                    selectedTab !== 'favorites' && (
                        <CustomPagination totalPages={heroesResponse?.pages ?? 1} />
                    )
                }
            </>
        </>
    )
}

export default HomePage;