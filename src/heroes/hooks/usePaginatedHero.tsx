import { useQuery } from '@tanstack/react-query';
import { getHeroesByPage } from '../actions/get-heroes-by-page.action';

export const usePaginatedHero = (
    page: string,
    limit: string,
    category: string = 'all',
    advancedFilters?: {
        team?: string;
        universe?: string;
        status?: string;
        strength?: string;
    }
) => {
    const filterKey = advancedFilters
        ? JSON.stringify(advancedFilters)
        : 'none';

    return useQuery({
        queryKey: ['heroes', { page: page, limit: limit, category, filters: filterKey }],
        queryFn: () => getHeroesByPage(+page, +limit, category, advancedFilters),
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
