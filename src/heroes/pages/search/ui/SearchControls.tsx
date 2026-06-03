import { Search, Filter, X } from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { Slider } from "../../../../components/ui/slider";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
} from "../../../../components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../components/ui/select";
import { getFiltersAction } from "../../../../heroes/actions/get-filters.action";
import { translateFields } from "../../../../heroes/utils/translateFields";

export const SearchControls = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const inputRef = useRef<HTMLInputElement>(null);
    const [sliderValue, setSliderValue] = useState<number[]>([
        Number(searchParams.get('strength') || '0')
    ]);
    const activeAccordion = searchParams.get('active-accordion') ?? '';
    const selectedStrength = sliderValue[0];

    const setQueryParams = (name: string, value: string) => {
        setSearchParams((prev) => {
            prev.set(name, value);
            return prev;
        });
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            const value = inputRef.current?.value ?? '';
            setSearchParams(prev => {
                prev.set('name', value);
                return prev;
            })
        }
    }

    const handleSliderChange = (value: number[]) => {
        setSliderValue(value);
        setQueryParams('strength', value[0].toString());
    }

    const handleSliderComplete = (value: number[]) => {
        setSliderValue(value);
        setSearchParams(prev => {
            prev.set('strength', value[0].toString());
            prev.set('page', '1');
            return prev;
        });
    }

    // Fetch filter options from the API
    const { data: filterOptions } = useQuery({
        queryKey: ['filters'],
        queryFn: () => getFiltersAction(),
        staleTime: 1000 * 60 * 5,
    });

    const hasActiveFilters = () => {
        const name = searchParams.get('name');
        const team = searchParams.get('team');
        const category = searchParams.get('category');
        const universe = searchParams.get('universe');
        const status = searchParams.get('status');
        const strength = searchParams.get('strength');
        return !!(name || team || category || universe || status || (strength && Number(strength) > 0));
    }

    const handleAccordionChange = (value: string) => {
        if (value === 'advance-filters' || value === '') {
            setQueryParams('active-accordion', value);
        }
    }

    const clearAllFilters = () => {
        setSearchParams((prev) => {
            prev.delete('name');
            prev.delete('team');
            prev.delete('category');
            prev.delete('universe');
            prev.delete('status');
            prev.delete('strength');
            prev.delete('active-accordion');
            prev.set('page', '1');
            return prev;
        });
        setSliderValue([0]);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    return (
        <>
            <div className="flex flex-col gap-4 mb-8">
                {/* Search */}
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <Input
                        ref={inputRef}
                        placeholder="Buscar por el nombre de héroes, villanos..."
                        className="pl-12 h-12 text-lg bg-white"
                        onKeyDown={handleKeyDown}
                        defaultValue={searchParams.get('name') ?? ''}
                    />
                </div>

                {/* Action buttons */}
                <div className="flex w-70 gap-2">
                    <Button variant={activeAccordion === 'advance-filters' ? "default" : "outline"} className="h-12"
                        onClick={() => {
                            if (activeAccordion === 'advance-filters') {
                                setQueryParams('active-accordion', '');
                                return;
                            }
                            setQueryParams('active-accordion', 'advance-filters')
                        }}
                    >
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros avanzados
                    </Button>
                </div>
            </div>


            {/*Búsquedas avanzadas */}
            <Accordion type="single" collapsible value={activeAccordion} onValueChange={handleAccordionChange}>
                <AccordionItem value="advance-filters">
                    <AccordionContent>
                        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm border">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Filtros Avanzados</h3>
                                <Button
                                    variant="ghost"
                                    onClick={clearAllFilters}
                                    disabled={!hasActiveFilters()}
                                    className="gap-2"
                                >
                                    <X className="h-4 w-4" />
                                    Limpiar todo
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Equipo</label>
                                    <Select
                                        value={searchParams.get('team') || undefined}
                                        onValueChange={(value) => {
                                            setSearchParams(prev => {
                                                if (value === 'all') {
                                                    prev.delete('team');
                                                } else {
                                                    prev.set('team', value);
                                                }
                                                prev.set('page', '1');
                                                return prev;
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Todos los equipos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los equipos</SelectItem>
                                            {filterOptions?.teams.map(team => (
                                                <SelectItem key={team} value={team}>{team}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Categoría</label>
                                    <Select
                                        value={searchParams.get('category') || undefined}
                                        onValueChange={(value) => {
                                            setSearchParams(prev => {
                                                if (value === 'all') {
                                                    prev.delete('category');
                                                } else {
                                                    prev.set('category', value);
                                                }
                                                prev.set('page', '1');
                                                return prev;
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Todas las categorías" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas las categorías</SelectItem>
                                            {filterOptions?.categories.map(category => (
                                                <SelectItem key={category} value={category}>{translateFields[category] ?? category}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Universo</label>
                                    <Select
                                        value={searchParams.get('universe') || undefined}
                                        onValueChange={(value) => {
                                            setSearchParams(prev => {
                                                if (value === 'all') {
                                                    prev.delete('universe');
                                                } else {
                                                    prev.set('universe', value);
                                                }
                                                prev.set('page', '1');
                                                return prev;
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Todos los universos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los universos</SelectItem>
                                            {filterOptions?.universes.map(universe => (
                                                <SelectItem key={universe} value={universe}>{universe}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Estado</label>
                                    <Select
                                        value={searchParams.get('status') || undefined}
                                        onValueChange={(value) => {
                                            setSearchParams(prev => {
                                                if (value === 'all') {
                                                    prev.delete('status');
                                                } else {
                                                    prev.set('status', value);
                                                }
                                                prev.set('page', '1');
                                                return prev;
                                            });
                                        }}
                                    >
                                        <SelectTrigger className="h-10 w-full">
                                            <SelectValue placeholder="Todos los estados" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos los estados</SelectItem>
                                            {filterOptions?.statuses.map(status => (
                                                <SelectItem key={status} value={status}>{translateFields[status] ?? status}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="text-sm font-medium">Fuerza mínima: {selectedStrength}/10</label>
                                <Slider
                                    value={sliderValue}
                                    onValueChange={handleSliderChange}
                                    onValueCommit={handleSliderComplete}
                                    max={10}
                                    step={1}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </>
    )
}
