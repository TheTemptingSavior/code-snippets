import {useState} from "react";
import {PinAngle, PinAngleFill} from "react-bootstrap-icons";
import {BareSnippetType, SnippetType} from "@/lib/snippets";
import {useSnippetContext} from "@/context";

export default function PinButton({snippet, isPinned}: {snippet: SnippetType | BareSnippetType, isPinned: boolean}) {
  const {snippets, setSnippets} = useSnippetContext();
  const [pinned, setPinned] = useState<boolean>(isPinned);

  const onClick = async () => {
    try {
      await fetch(
        `/api/snippets/${snippet.id}/pin`,
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
          body: JSON.stringify({pinned: !pinned})
        }
      )
        .then((response) => {
          if (response.ok) {
            setPinned(!pinned);
            // TODO: May need to call `setSnippets` here rather than modifying this snippet
            setSnippets(snippets.map((s) => {
              if (s.id === snippet.id) {
                s.pinned = !pinned;
              }
              return s;
            }));
          }
        })
    } catch (e) {
      console.error(e);
    }
  }

  if (pinned) {
    return <PinAngleFill onClick={onClick} style={{ cursor: 'pointer' }} size={16} title='Pin Snippet' />
  } else {
    return <PinAngle onClick={onClick} style={{ cursor: 'pointer' }} size={16} title='Pin Snippet' />
  }
}
