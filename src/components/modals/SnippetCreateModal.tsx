import {Button, Container, Form, Modal} from "react-bootstrap";
import React, {useState} from "react";
import {useSnippetContext} from "@/context";
import {SnippetType} from "@/lib/snippets";


function CreateSnippet(
  {show, setShow}: {show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>}
) {
  const {snippets, setSnippets} = useSnippetContext();
  const [formValidated, setFormValidated] = useState(false);
  const [formValue, setFormValue] = useState({
    title: '',
    description: '',
    language: '',
    tags: '',
    content: '',
    published: true
  });

  const onCancelHandler = () => {
    setShow(false);

    // Reset our states
    setFormValue({
      title: '',
      description: '',
      language: '',
      tags: '',
      content: '',
      published: true
    });
  }

  const sendForm = async () => {
    await fetch(
      '/api/snippets',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({...formValue, tags: formValue.tags.split(',')})
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Failed to create new snippet: ${response.statusText}`)
        }
      })
      .then((data: SnippetType) => {
        console.log("Adding snippet to local data:", data);
        setSnippets([...snippets, data]);
      })
      .catch((err: Error) => {
        alert(`Snippet create failed: ${err.message}`);
      });
  }

  const onFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // Disable the form propagation as we will handle the API request manually
    event.preventDefault();
    event.stopPropagation();

    setFormValidated(true);

    await sendForm();
    setShow(false);
    setFormValue({
      title: '',
      description: '',
      language: '',
      tags: '',
      content: '',
      published: true
    })
  }

  return (
    <Modal className='text-white' show={show} onHide={() => setShow(false)} fullscreen={true} animation={true}>
      <Modal.Header className='bg-dark' closeButton>
        <Modal.Title>Create Snippet</Modal.Title>
      </Modal.Header>
      <Modal.Body className='bg-dark'>
        <Container>
          <Form noValidate validated={formValidated} onSubmit={onFormSubmit}>
            <Form.Group className='mb-3' controlId='formSnippetTitle'>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter Title'
                value={formValue.title}
                onChange={(event) => setFormValue({...formValue, title: event.target.value})}
              />
              <Form.Control.Feedback type="invalid">
                Snippet title must be unique
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formSnippetDescription'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder='Snippet Description'
                value={formValue.description}
                onChange={(event) => setFormValue({...formValue, description: event.target.value})}
              />
              <Form.Control.Feedback type="invalid">
                You must provide a small description for the snippet
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formSnippetLanguage'>
              <Form.Label>Language</Form.Label>
              <Form.Control
                type='text'
                placeholder='python'
                value={formValue.language}
                onChange={(event) => setFormValue({...formValue, language: event.target.value})}
              />
              <Form.Text className='text-muted'>
                Programming language of the snippet
              </Form.Text>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formSnippetTags'>
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type='text'
                placeholder='tag1,tag2'
                value={formValue.tags}
                onChange={(event) => setFormValue({...formValue, tags: event.target.value})}
              />
              <Form.Text className='text-muted'>
                Comma separated tag names
              </Form.Text>
            </Form.Group>
            <Form.Group className='mb-3' controlId='formSnippetContent'>
              <Form.Label>Snippet</Form.Label>
              <Form.Control
                as='textarea'
                placeholder='#!/bin/...'
                style={{ minHeight: '100px' }}
                value={formValue.content}
                onChange={(event) => setFormValue({...formValue, content: event.target.value})}
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='formSnippetPublished'>
              <Form.Label>Published</Form.Label>
              <Form.Check type='radio' label='Yes' name='snippet-published' id='snippet-published-yes' defaultChecked={formValue.published} />
              <Form.Check type='radio' label='No' name='snippet-published' id='snippet-published-no' defaultChecked={!formValue.published} />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Button variant='primary' type='submit'>Save</Button>
            </Form.Group>
          </Form>
        </Container>
      </Modal.Body>
      <Modal.Footer className='bg-dark'>
        <Button variant="secondary" onClick={onCancelHandler}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CreateSnippet;
