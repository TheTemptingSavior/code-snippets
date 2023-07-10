import React, {ReactNode, useState} from "react";

interface ContextProps {
  children?: ReactNode;
}

export type FilterType = 'title' | 'language' | 'createdAt' | 'updatedAt' | 'viewCount';
export type FilterOrder = 'asc' | 'desc';

interface ISearchContext {
  query: string[][];
  pinnedOnly: boolean;
  filter: FilterType;
  filterOrder: FilterOrder;
  setQuery: (newQuery: string[][]) => void;
  setPinnedOnly: (pinned: boolean) => void;
  setFilter: (newFilter: FilterType) => void;
  setFilterOrder: (newOrder: FilterOrder) => void;
}


export const SearchContext = React.createContext<ISearchContext>({
  query: [],
  pinnedOnly: false,
  filter: 'title',
  filterOrder: 'asc',
  setQuery: () => {},
  setPinnedOnly: () => {},
  setFilter: () => {},
  setFilterOrder: () => {},
});

export const SearchContextProvider = (props: ContextProps) => {
  const [globalQuery, setGlobalQuery] = useState<string[][]>([]);
  const [globalPinnedOnly, setGlobalPinnedOnly] = useState<boolean>(false);
  const [globalFilter, setGlobalFilter] = useState<FilterType>('title');
  const [globalFilterOrder, setGlobalFilterOrder] = useState<FilterOrder>('asc');

  return (
    <SearchContext.Provider value={{
      query: globalQuery,
      pinnedOnly: globalPinnedOnly,
      filter: globalFilter,
      filterOrder: globalFilterOrder,
      setQuery: setGlobalQuery,
      setPinnedOnly: setGlobalPinnedOnly,
      setFilter: setGlobalFilter,
      setFilterOrder: setGlobalFilterOrder,
    }}>
      {props.children}
    </SearchContext.Provider>
  )
}
