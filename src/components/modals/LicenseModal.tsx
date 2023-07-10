import {Modal} from "react-bootstrap";
import React from "react";


function LicenseModal(
  {show, setShow, licenseName, licenseText}
  :
  {show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>>, licenseName: string, licenseText: string}
) {
  const handleClose = () => setShow(false);

  return (
    <Modal show={show} onHide={handleClose} size='xl' centered>
      <Modal.Header closeButton>
        <Modal.Title>License: {licenseName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <pre>{licenseText}</pre>
      </Modal.Body>
    </Modal>
  )
}

export default LicenseModal;
