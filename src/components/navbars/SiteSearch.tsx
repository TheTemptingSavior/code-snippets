import {Badge, Button, Container, Form, ListGroup, Navbar, OverlayTrigger, Popover} from "react-bootstrap";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {useSearchContext, useSnippetContext} from "@/context";
import {Funnel, PinAngle, PinAngleFill, SortAlphaDown, SortAlphaUp} from "react-bootstrap-icons";
import {FilterType} from "@/context/SearchContext";

export const SiteSearch = () => {
  const {
    query,
    pinnedOnly,
    filter,
    filterOrder,
    setQuery,
    setPinnedOnly,
    setFilter,
    setFilterOrder
  } = useSearchContext();
  const {snippets, totalSnippets, tags, setSnippets} = useSnippetContext();

  const [searchValue, setSearchValue] = useState<string>('');
  useEffect(() => {
    console.debug("Search updated; Refreshing snippet list");
    fetch(
      '/api/search',
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        body: JSON.stringify({query: query})
      }
    )
      .then((response) => response.ok ? response.json() : {data: []})
      .then((data) => setSnippets(data.data))
      .catch((err: Error) => {
        console.error(err.message);
      });
  }, [query, setSnippets])

  const searchValueSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code !== 'Enter') {
      return;
    }
    // Attempt to parse the new input we just got
    if (searchValue.startsWith('title:')) {
      const value: string = searchValue.substring(6);
      setQuery([...query, ['title', value]]);
    } else if (searchValue.startsWith('content:')) {
      const value: string = searchValue.substring(8);
      setQuery([...query, ['content', value]]);
    } else if (searchValue.startsWith('published:')) {
      const value: string = searchValue.substring(10).toLowerCase();
      const booleanValue: boolean = value === 'yes' || value === 'y' || value === 'true' || value === 't';
      setQuery([...query, ['published', booleanValue ? 'true' : 'false']]);
    } else if (searchValue.startsWith('pinned:')) {
      const value: string = searchValue.substring(7).toLowerCase();
      const booleanValue: boolean = value === 'yes' || value === 'y' || value === 'true' || value === 't';
      setQuery([...query, ['pinned', booleanValue ? 'true' : 'false']]);
    }else if (searchValue.startsWith('author:')) {
      const value: string = searchValue.substring(7);
      setQuery([...query, ['author', value]]);
    } else if (searchValue.startsWith('tag:')) {
      const value: string = searchValue.substring(4);
      setQuery([...query, ['tag', value]]);
    } else {
      setQuery([...query, ['any', searchValue]]);
    }

    setSearchValue('');
  }
  const filterUpdate = (filterType: FilterType) => {
    if (filter === filterType) {
      if (filterOrder === 'asc') {
        setFilterOrder('desc');
      } else {
        setFilter('title');
        setFilterOrder('asc');
      }
    } else {
      setFilter(filterType);
      setFilterOrder('asc');
    }
  }
  const popover = (
    <Popover style={{ width: '14em' }}>
      <Popover.Header as="h3">Filter</Popover.Header>
      <ListGroup>
        <ListGroup.Item action onClick={() => filterUpdate('title')}>
          Title
          {
            filter === 'title' ?
              (filterOrder === 'asc' ? <SortAlphaUp size={16} style={{ float: 'right' }} /> : <SortAlphaDown size={16} style={{ float: 'right' }} />)
              :
              (<></>)
          }
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => filterUpdate('language')}>
          Language
          {
            filter === 'language' ?
              (filterOrder === 'asc' ? <SortAlphaUp size={16} style={{ float: 'right' }} /> : <SortAlphaDown size={16} style={{ float: 'right' }} />)
              :
              (<></>)
          }
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => filterUpdate('createdAt')}>
          Created At
          {
            filter === 'createdAt' ?
              (filterOrder === 'asc' ? <SortAlphaUp size={16} style={{ float: 'right' }} /> : <SortAlphaDown size={16} style={{ float: 'right' }} />)
              :
              (<></>)
          }
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => filterUpdate('updatedAt')}>
          Updated At
          {
            filter === 'updatedAt' ?
              (filterOrder === 'asc' ? <SortAlphaUp size={16} style={{ float: 'right' }} /> : <SortAlphaDown size={16} style={{ float: 'right' }} />)
              :
              (<></>)
          }
        </ListGroup.Item>
        <ListGroup.Item action onClick={() => filterUpdate('viewCount')}>
          View Count
          {
            filter === 'viewCount' ?
              (filterOrder === 'asc' ? <SortAlphaUp size={16} style={{ float: 'right' }} /> : <SortAlphaDown size={16} style={{ float: 'right' }} />)
              :
              (<></>)
          }
        </ListGroup.Item>
      </ListGroup>
    </Popover>
  );
  const tagsPopover = (
    <Popover style={{ width: '14em' }}>
      <Popover.Header as="h3">Tags</Popover.Header>
      <ListGroup>
        {tags
          .sort((tagA, tagB) => {
            if (tagA.uses === tagB.uses) {
              return tagA.name.toLowerCase() > tagB.name.toLowerCase() ? 1 : -1
            }
            return tagA.uses > tagB.uses ? -1 : 1;
          })
          .map((tag) => {
            return (
              <ListGroup.Item key={tag.id} action onClick={() => setQuery([...query, ['tag', tag.name]])}>
                {tag.name}
                <Badge style={{ float: 'right' }} pill bg='primary'>{tag.uses}</Badge>
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
    </Popover>
  );

  return (
    <>
      <Navbar bg='dark'>
        <Container>
          <Navbar.Brand href="#">
            <Image
              src="https://placehold.co/32x32"
              width="32"
              height="32"
              className="d-inline-block align-top"
              alt="Logo"
            />
          </Navbar.Brand>
          <Form className='flex-fill d-flex' onSubmit={(e: React.FormEvent<HTMLFormElement>) => e.preventDefault()}>
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 bg-dark text-white"
              aria-label="Search"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              onKeyDown={searchValueSubmit}
            />
            <Form.Control.Feedback type='invalid'>
              Press Enter to search
            </Form.Control.Feedback>
          </Form>
          {pinnedOnly ?
            (<PinAngleFill size={24} color='white' title='Pinned Only' onClick={() => setPinnedOnly(false)} />)
            :
            (<PinAngle size={24} color='white' title='Pinned Only' onClick={() => setPinnedOnly(true)} />)
          }
          <OverlayTrigger
            delay={0}
            defaultShow={false}
            trigger="click"
            placement="bottom-start"
            overlay={popover}
          >
            <Funnel size={24} color='white' title='Filter options' />
          </OverlayTrigger>
        </Container>
      </Navbar>
      <Navbar className='mb-3' bg='secondary'>
        <Container>
          <Navbar.Text className='text-white'>Showing {snippets.length} of {totalSnippets}</Navbar.Text>
          <Navbar.Text>
            {query.length ?
              <></>
              :
              <span className='text-white'>No Active Searches</span>
            }
            {query.map((q) => {
              return (
                <Badge
                  key={q[0]+q[1]}
                  onClick={() => setQuery(query.filter((item) => item[0] !== q[0] && item[1] !== q[1]))}
                  style={{ cursor: 'pointer' }}
                  bg='primary'
                >
                  {q[0]} : {q[1]}
                </Badge>
              )
            })}
          </Navbar.Text>
          <OverlayTrigger
            delay={0}
            defaultShow={false}
            trigger="click"
            placement="bottom-start"
            overlay={tagsPopover}
          >
            <Button variant='dark' className='float-end'>Tags</Button>
          </OverlayTrigger>
        </Container>
      </Navbar>
    </>
  )
}
