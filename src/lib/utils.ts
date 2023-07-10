import slugify from "slugify";
import {SnippetType} from "@/lib/snippets";

export const makeSlug = (inString: string): string => {
  return slugify(inString, {
    replacement: '-',
    lower: true,
    strict: true,
    locale: 'en',
    trim: true
  })
}
