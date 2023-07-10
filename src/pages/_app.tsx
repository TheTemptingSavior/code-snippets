import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import {SnippetContextProvider} from "@/context/SnippetContext";
import {SearchContextProvider} from "@/context/SearchContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SnippetContextProvider>
      <SearchContextProvider>
        <Component {...pageProps} />
      </SearchContextProvider>
    </SnippetContextProvider>
  )
}
