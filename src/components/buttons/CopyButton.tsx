import {Button, Overlay, Tooltip} from "react-bootstrap";
import {useEffect, useRef, useState} from "react";

export default function CopyButton({snippetId}: {snippetId: number}) {
  const [tooltipValue, setTooltipValue] = useState("Copied!")
  const [tooltipShowing, setShowTooltip] = useState(false);
  const target = useRef(null);

  useEffect(() => {
    if (tooltipShowing) {
      setTimeout(() => setShowTooltip(false), 1000)
    }
  }, [tooltipShowing])

  const onClick = async () => {
    try {
      await fetch(`/api/snippets/${snippetId}/raw`)
        .then((response) => response.text())
        .then((text) => {
          navigator.clipboard.writeText(text);
        });
      setTooltipValue("Copied!");
      setShowTooltip(true);
    } catch (e) {
      console.error(e);
      setTooltipValue("Copy Failed");
      setShowTooltip(true);
    }
  }

  return (
    <>
      <Button ref={target} variant='secondary' onClick={onClick}>Copy</Button>
      <Overlay target={target.current} show={tooltipShowing} placement='top'>
        {(props) => (
          <Tooltip {...props}>
            {tooltipValue}
          </Tooltip>
        )}
      </Overlay>
    </>
  )
}
