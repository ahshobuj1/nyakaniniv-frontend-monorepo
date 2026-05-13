"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { Country, State, City } from "country-state-city";
import { 
  Button, 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList, 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@repo/ui";
import { cn } from "../../../../../../packages/ui/src/lib/utils"

interface LocationSelectorProps {
  countryValue?: string;
  countryCodeValue?: string;
  cityValue?: string;
  onCountryChange: (name: string, code: string) => void;
  onCityChange: (name: string) => void;
  error?: string;
}

export function LocationSelector({
  countryValue,
  countryCodeValue,
  cityValue,
  onCountryChange,
  onCityChange,
  error
}: LocationSelectorProps) {
  const [openCountry, setOpenCountry] = React.useState(false);
  const [openCity, setOpenCity] = React.useState(false);
  const [countrySearch, setCountrySearch] = React.useState("");
  const [citySearch, setCitySearch] = React.useState("");

  const allCountries = React.useMemo(() => Country.getAllCountries(), []);
  
  const filteredCountries = React.useMemo(() => {
    if (!countrySearch) return allCountries;
    return allCountries.filter(c => 
      c.name.toLowerCase().includes(countrySearch.toLowerCase())
    );
  }, [allCountries, countrySearch]);

  const cities = React.useMemo(() => {
    if (!countryCodeValue) return [];
    // We check if there are states. If so, we might need a state selector too, 
    // but the requirement says "Automatically load its states... then cities".
    // For simplicity, if we select a country, we'll try to find states. 
    // If there are states, we could just list all cities in the country or add a state selector.
    // The requirement says: "When a state/province is selected: Automatically load its cities."
    // This implies a 3-step process if states exist.
    
    // Let's check if the country has states
    const states = State.getStatesOfCountry(countryCodeValue);
    if (states.length === 0) {
      return City.getCitiesOfCountry(countryCodeValue) || [];
    }
    
    // If states exist, we should ideally have a state selector. 
    // But the prompt says "If the selected country has no states... load cities directly".
    // I'll add a state selector if states exist.
    return []; // Will handle state logic below if needed
  }, [countryCodeValue]);

  // To keep it clean as per "Requirements", I'll implement Country -> State (if exists) -> City.
  const [selectedStateCode, setSelectedStateCode] = React.useState<string>("");
  const [openState, setOpenState] = React.useState(false);
  const [stateSearch, setStateSearch] = React.useState("");

  const states = React.useMemo(() => {
    if (!countryCodeValue) return [];
    return State.getStatesOfCountry(countryCodeValue);
  }, [countryCodeValue]);

  const filteredStates = React.useMemo(() => {
    if (!stateSearch) return states;
    return states.filter(s => s.name.toLowerCase().includes(stateSearch.toLowerCase()));
  }, [states, stateSearch]);

  const availableCities = React.useMemo(() => {
    if (!countryCodeValue) return [];
    if (states.length > 0) {
      if (!selectedStateCode) return [];
      return City.getCitiesOfState(countryCodeValue, selectedStateCode) || [];
    }
    return City.getCitiesOfCountry(countryCodeValue) || [];
  }, [countryCodeValue, states, selectedStateCode]);

  const filteredCities = React.useMemo(() => {
    if (!citySearch) return availableCities;
    return availableCities.filter(c => c.name.toLowerCase().includes(citySearch.toLowerCase()));
  }, [availableCities, citySearch]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Country Selector */}
        <div className="space-y-2">
          <label className="block text-[13px] font-bold text-gray-900">
            Country
          </label>
          <Popover open={openCountry} onOpenChange={setOpenCountry}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCountry}
                className={cn(
                  "w-full justify-between bg-white py-6 border-transparent shadow-sm hover:border-gray-200 focus:border-gray-300",
                  !countryValue && "text-gray-500",
                  error && "border-red-500"
                )}
              >
                <div className="flex items-center gap-2 truncate">
                  {countryCodeValue && (
                    <span>{allCountries.find(c => c.isoCode === countryCodeValue)?.flag}</span>
                  )}
                  {countryValue || "Select Country"}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search country..." 
                  onValueChange={setCountrySearch}
                />
                <CommandList>
                  <CommandEmpty>No country found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCountries.slice(0, 50).map((country) => (
                      <CommandItem
                        key={country.isoCode}
                        value={country.name}
                        onSelect={() => {
                          onCountryChange(country.name, country.isoCode);
                          setSelectedStateCode(""); // Reset state
                          onCityChange(""); // Reset city
                          setOpenCountry(false);
                          setCountrySearch("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            countryCodeValue === country.isoCode ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span className="mr-2">{country.flag}</span>
                        {country.name}
                      </CommandItem>
                    ))}
                    {filteredCountries.length > 50 && (
                      <div className="px-4 py-2 text-xs text-gray-500 text-center">
                        Search to see more results
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* State Selector (Conditional) */}
        {states.length > 0 && (
          <div className="space-y-2">
            <label className="block text-[13px] font-bold text-gray-900">
              State/Province
            </label>
            <Popover open={openState} onOpenChange={setOpenState}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openState}
                  disabled={!countryCodeValue}
                  className="w-full justify-between bg-white py-6 border-transparent shadow-sm hover:border-gray-200 focus:border-gray-300"
                >
                  <div className="truncate">
                    {selectedStateCode 
                      ? states.find(s => s.isoCode === selectedStateCode)?.name 
                      : "Select State"}
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput 
                    placeholder="Search state..." 
                    onValueChange={setStateSearch}
                  />
                  <CommandList>
                    <CommandEmpty>No states found.</CommandEmpty>
                    <CommandGroup>
                      {filteredStates.map((state) => (
                        <CommandItem
                          key={state.isoCode}
                          value={state.name}
                          onSelect={() => {
                            setSelectedStateCode(state.isoCode);
                            onCityChange(""); // Reset city
                            setOpenState(false);
                            setStateSearch("");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStateCode === state.isoCode ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {state.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        )}

        {/* City Selector */}
        <div className={cn("space-y-2", states.length > 0 && "md:col-span-2")}>
          <label className="block text-[13px] font-bold text-gray-900">
            City
          </label>
          <Popover open={openCity} onOpenChange={setOpenCity}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCity}
                disabled={!countryCodeValue || (states.length > 0 && !selectedStateCode)}
                className={cn(
                  "w-full justify-between bg-white py-6 border-transparent shadow-sm hover:border-gray-200 focus:border-gray-300",
                  !cityValue && "text-gray-500"
                )}
              >
                <div className="truncate">
                  {cityValue || "Select City"}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput 
                  placeholder="Search city..." 
                  onValueChange={setCitySearch}
                />
                <CommandList>
                  <CommandEmpty>No cities found.</CommandEmpty>
                  <CommandGroup>
                    {filteredCities.slice(0, 100).map((city) => (
                      <CommandItem
                        key={`${city.name}-${city.latitude}-${city.longitude}`}
                        value={city.name}
                        onSelect={() => {
                          onCityChange(city.name);
                          setOpenCity(false);
                          setCitySearch("");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            cityValue === city.name ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {city.name}
                      </CommandItem>
                    ))}
                    {filteredCities.length > 100 && (
                      <div className="px-4 py-2 text-xs text-gray-500 text-center">
                        Search to see more results
                      </div>
                    )}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
