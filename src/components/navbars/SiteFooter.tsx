import React, {useState} from "react";
import {Container, Nav, Navbar} from "react-bootstrap";
import LicenseModal from "@/components/modals/LicenseModal";

export const SiteFooter = ({licenseName, licenseText}: {licenseName: string, licenseText: string}) => {
  const [showLicense, setShowLicense] = useState<boolean>(false);

  return (
      <Navbar bg='dark' fixed='bottom'>
      <LicenseModal show={showLicense} setShow={setShowLicense}  licenseName={licenseName} licenseText={licenseText} />
      <Container>
        <Nav className='me-auto'>
          <Navbar.Text style={{ marginRight: '10px' }} className='text-white'>
            © 2020 Copyright: <strong>Code Snippets</strong>
          </Navbar.Text>
        </Nav>
      </Container>
    </Navbar>
  )
}
