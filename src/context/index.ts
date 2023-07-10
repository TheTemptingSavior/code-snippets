import {useContext} from 'react';
import {SnippetContext} from "@/context/SnippetContext";
import {SearchContext} from "@/context/SearchContext";


export const useSnippetContext = () => useContext(SnippetContext);
export const useSearchContext = () => useContext(SearchContext);
