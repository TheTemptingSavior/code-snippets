import React, {useState} from 'react'
import {
  Button,
  Card,
  Col,
  Container,
  Row,
} from "react-bootstrap";
import {SnippetType} from "@/lib/snippets";
import {SnippetCard} from "@/components/cards/SnippetCard";
import SnippetModal from "@/components/modals/SnippetModal";
import CopyButton from "@/components/buttons/CopyButton";
import SnippetDeleteModal from '@/components/modals/SnippetDeleteModal';
import {SiteFooter} from "@/components/navbars/SiteFooter";
import CreateSnippet from "@/components/modals/SnippetCreateModal";
import Image from "next/image";

import plusIcon from "@/public/plus-icon.png"
import {useSearchContext, useSnippetContext} from "@/context";
import {SiteSearch} from "@/components/navbars/SiteSearch";
import {GetStaticProps} from "next";
import {readFileSync} from "fs";
import {join} from "path";
import EditSnippet from "@/components/modals/SnippetEditModal";


function Home({licenseName, licenseText}: { licenseName: string, licenseText: string }) {
  const {snippets} = useSnippetContext();
  const {pinnedOnly, filter, filterOrder} = useSearchContext();

  // Snippet interaction
  const [snippetModalShow, setSnippetModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [editModalShow, setEditModalShow] = useState(false);
  const [currentSnippet, setCurrentSnippet] = useState<SnippetType | null>(null);

  const snippetSort = (a: SnippetType, b: SnippetType) => {
    const titleOrder = (a: string, b: string) => a.toLowerCase() > b.toLowerCase() ? 1 : -1;
    switch (filter) {
      case "title":
        return filterOrder === 'asc' ?
          (a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1)
          :
          (a.title.toLowerCase() > b.title.toLowerCase() ? -1 : 1);
      case "language":
        if (a.language === b.language) {
          return titleOrder(a.title, b.title);
        }
        return filterOrder === 'asc' ?
          (a.language > b.language ? 1 : -1)
          :
          (a.language > b.language ? -1 : 1);
      case "viewCount":
        if (a.viewCount === b.viewCount) {
          return titleOrder(a.title, b.title);
        }
        return filterOrder === 'asc' ?
          (a.viewCount > b.viewCount ? 1 : -1)
          :
          (a.viewCount > b.viewCount ? -1 : 1);
      case "createdAt":
        if (a.createdAt === b.createdAt) {
          return titleOrder(a.title, b.title);
        }
        return filterOrder === 'asc' ?
          (a.createdAt > b.createdAt ? 1 : -1)
          :
          (a.createdAt > b.createdAt ? -1 : 1);
      case "updatedAt":
        if (a.updatedAt === b.updatedAt) {
          return titleOrder(a.title, b.title);
        }
        return filterOrder === 'asc' ?
          (a.updatedAt > b.updatedAt ? 1 : -1)
          :
          (a.updatedAt > b.updatedAt ? -1 : 1);
    }
  }

  const makeSnippet = (s: SnippetType) => {
    const viewClickHandler = () => {
      setCurrentSnippet(s);
      setSnippetModalShow(true);
      fetch(`/api/snippets/${s.id}/view`)
        .then((response) => console.log(`Visit response: ${response.statusText}`));
    };
    const editClickHandler = () => {
      setCurrentSnippet(s);
      setEditModalShow(true);
    }
    const viewButton: JSX.Element = <Button variant='info' onClick={viewClickHandler}>View</Button>
    const editButton: JSX.Element = <Button variant='warning' onClick={editClickHandler}>Edit</Button>

    return (
      <Col key={s.id}>
        <SnippetCard
          snippet={s}
          viewButton={viewButton}
          editButton={editButton}
          copyButton={<CopyButton snippetId={s.id}/>}
        />
      </Col>
    )
  }

  return (
    <>
      <SiteSearch />

      {currentSnippet ?
        <SnippetModal show={snippetModalShow} setShow={setSnippetModalShow} snippet={currentSnippet}/>
        :
        <></>
      }
      {currentSnippet ?
        <SnippetDeleteModal show={deleteModalShow} setShow={setDeleteModalShow} snippet={currentSnippet}/>
        :
        <></>
      }
      {currentSnippet ?
        <EditSnippet show={editModalShow} setShow={setEditModalShow} snippet={currentSnippet}/>
        :
        <></>
      }
      <CreateSnippet show={createModalShow} setShow={setCreateModalShow}/>

      <Container>
        <Row xs={1} sm={2} md={4}>
          <Col key='createButton'>
            <Card className='h-100 d-flex bg-dark text-white' style={{cursor: 'pointer'}} onClick={() => setCreateModalShow(true)}>
              <Card.Body className='align-items-center d-flex justify-content-center'>
                <>
                  <Image src={plusIcon} width='70' height='70' alt='Plus Icon'/>
                  <br/>
                  Create a new snippet
                </>
              </Card.Body>
            </Card>
          </Col>
          {snippets
            .filter((snippet) => pinnedOnly ? snippet.pinned : true)
            .sort(snippetSort)
            .map(makeSnippet)
          }
        </Row>
      </Container>
      <SiteFooter licenseName={licenseName} licenseText={licenseText} />
    </>
  )
}


export default Home;

export const getStaticProps: GetStaticProps<{ licenseName: string, licenseText: string }> = () => {
  const licenseName: string = "MIT";
  const data = readFileSync(join(process.cwd(), "LICENSE.txt"), {encoding: 'utf-8', flag: 'r'});
  return {
    props: {
      licenseName: licenseName,
      licenseText: data,
    }
  }
}
