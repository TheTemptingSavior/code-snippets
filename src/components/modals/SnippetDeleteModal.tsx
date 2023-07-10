import React, {useEffect, useState} from "react";
import {SnippetType} from "@/lib/snippets";
import {Button, Form, Modal} from "react-bootstrap";

function SnippetDeleteModal(
  {show, setShow, snippet}: {show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>, snippet: SnippetType}
) {
  const handleClose = () => setShow(false);
  const [deleteEnabled, setDeleteEnabled] = useState(false);
  const [inputBoxText, setInputBoxText] = useState('');

  const inputOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;

    setInputBoxText(newValue);
    setDeleteEnabled(newValue === 'delete me');
    console.log("Input changed;", newValue);
  }

  const onDeleteClick = async () => {
    await fetch(`/api/snippets/${snippet.id}`, { method: 'DELETE' })
      .then((response) => response.json())
      .then((data) => { alert('Snippet deleted'); })
  }

  useEffect(() => {
    if (show) {
      console.log("Just opened modal; resetting input")
      setInputBoxText('');
    }
  }, [show]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Delete Snippet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        You are about to delete the snippet &quot;<strong>{snippet.title}</strong>&quot;.
        <br /><br />
        To delete this snippet, please type &quot;{'delete me'}&quot; in the text box below:
        <Form.Control type="text" value={inputBoxText} onChange={inputOnChange}/>
      </Modal.Body>
      <Modal.Footer>
        {deleteEnabled ?
          <Button variant='danger' onClick={onDeleteClick}>Delete</Button>
          :
          <Button variant='danger' disabled>Delete</Button>
        }
      </Modal.Footer>
    </Modal>
  )
}

export default SnippetDeleteModal;
