import {Badge, ButtonGroup, Card, Stack} from "react-bootstrap";
import React from "react";
import {BareSnippetType, SnippetType} from "@/lib/snippets";
import {PinAngle} from "react-bootstrap-icons";
import PinButton from "@/components/buttons/PinButton";


interface Props {
  snippet: SnippetType | BareSnippetType;
  viewButton: JSX.Element;
  editButton: JSX.Element;
  copyButton: JSX.Element;
}


export const SnippetCard = ({snippet, viewButton, editButton, copyButton}: Props) => {
  return (
    <Card className='h-100 text-white bg-dark'>
      <Card.Header className='d-flex justify-content-between align-items-center'>
        <PinButton snippet={snippet} isPinned={snippet.pinned} />
      </Card.Header>
      <Card.Body>
        <Card.Title>
          {snippet.title}
        </Card.Title>
        <Card.Text>
          {snippet.tags.map((t) => <Badge pill key={t.slug} bg="primary" style={{ marginRight: '3px' }}>{t.name}</Badge>)}
        </Card.Text>
        <Card.Text>
          {snippet.description ? snippet.description : 'No description provided.'}
        </Card.Text>
      </Card.Body>
      <Card.Footer>
        {viewButton}
        <ButtonGroup style={{ float: 'right' }}>
          {editButton} {copyButton}
        </ButtonGroup>
      </Card.Footer>
    </Card>
  )
}



