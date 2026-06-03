import { heroApi } from "../api/hero.api";
import type { HeroesResponse } from "../types/get-heroes.response";

interface FiltersResponse {
    teams: string[];
    categories: string[];
    universes: string[];
    statuses: string[];
}

export const getFiltersAction = async (): Promise<FiltersResponse> => {
    const { data } = await heroApi.get<HeroesResponse>('/', {
        params: { limit: 100, offset: 0 }
    });

    const { heroes } = data;
    const teams = [...new Set(heroes.map(h => h.team))].sort();
    const categories = [...new Set(heroes.map(h => h.category))].sort();
    const universes = [...new Set(heroes.map(h => h.universe))].sort();
    const statuses = [...new Set(heroes.map(h => h.status))].sort();

    return { teams, categories, universes, statuses };
};
