import {Badge, Col, Modal, Row} from "react-bootstrap";
import React from "react";
import {SnippetType} from "@/lib/snippets";
import { atomDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';


function SnippetModal({show, setShow, snippet}: {show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>, snippet: SnippetType}) {
  const handleClose = () => setShow(false);

  return (
    <Modal className='text-white' show={show} onHide={handleClose} size='xl' centered>
      <Modal.Header className='bg-dark' closeButton>
        <Modal.Title>{snippet?.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        <Row xs={1} sm={1} md={2}>
          <Col>{snippet?.description}</Col>
          <Col>
            <>
              Language: {snippet.language}<br />
              Created At: {snippet.createdAt}<br />
              Updated At: {snippet.updatedAt}<br />
              Created By: {snippet.author?.username}<br />
              Published: {snippet.published ? 'Yes' : 'No'}<br />
              Views: {snippet.viewCount}<br />
              Tags: {snippet.tags.map((tag) => <Badge key={tag.id} pill bg="secondary">{tag.name}</Badge>)}
            </>
          </Col>
        </Row>
        <SyntaxHighlighter language={snippet?.language} style={atomDark} showLineNumbers={true} customStyle={{ maxHeight: '40em' }}>
          {snippet.content}
        </SyntaxHighlighter>
      </Modal.Body>
    </Modal>
  )
}

export default SnippetModal;
