import React, {ReactNode, useEffect, useState} from "react";
import {SnippetType} from "@/lib/snippets";
import {TagType} from "@/lib/tags";

interface ContextProps {
  children?: ReactNode;
}

interface ISnippetContext {
  snippets: SnippetType[];
  tags: TagType[];
  totalSnippets: number;
  setSnippets: (snippets: SnippetType[]) => void;
  setTags: (tags: TagType[]) => void;
  setTotalSnippets: (total: number) => void;
}


export const SnippetContext = React.createContext<ISnippetContext>({
  snippets: [],
  tags: [],
  totalSnippets: 0,
  setSnippets: () => {},
  setTags: () => {},
  setTotalSnippets: () => {}
});

export const SnippetContextProvider = (props: ContextProps) => {
  const [globalSnippets, setGlobalSnippets] = useState<SnippetType[]>([]);
  const [globalTags, setGlobalTags] = useState<TagType[]>([]);
  const [globalTotalSnippets, setGlobalTotalSnippets] = useState<number>(0);

  // Total snippet count
  useEffect(() => {
    fetch(
      '/api/info',
      { headers: {'Content-Type': 'application/json', 'Accept': 'application/json'} }
    )
      .then((response) => {
        if (response.ok) {
          return response.json()
        } else {
          throw new Error(`Failed to load snippet info: ${response.statusText}`);
        }
      })
      .then((data) => setGlobalTotalSnippets(data.snippetCount))
    .catch((err: Error) => console.error(err.message));
  }, []);
  // Tags load
  useEffect(() => {
    fetch(
      '/api/tags',
      {
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Failed gettings tags: ${response.statusText}`)
        }
      })
      .then((data) => data.data.sort((a: TagType, b: TagType) => a.uses === b.uses ? a.name > b.name : a.uses < b.uses))
      .then((data) => setGlobalTags(data))
      .catch((err: Error) => console.error(err.message));
  }, []);

  return (
    <SnippetContext.Provider value={{
      snippets: globalSnippets,
      tags: globalTags,
      totalSnippets: globalTotalSnippets,
      setSnippets: setGlobalSnippets,
      setTags: setGlobalTags,
      setTotalSnippets: setGlobalTotalSnippets
    }}>
      {props.children}
    </SnippetContext.Provider>
  )
}
