/* eslint-disable */

const defaultGetUserChecks = (response: Cypress.Response<any>) => {
  expect(response.status).to.eq(200);

  expect(response.body.count, 'Invalid count parameter').to.eq(2);
  expect(response.body.data.length, 'Data length does not match count').to.eq(2);

  const expectedProperties: string[] = ['id', 'username', 'createdAt', 'updatedAt', 'lastLogin'];
  for (const ep of expectedProperties) {
    expect(response.body.data[0]).to.haveOwnProperty(ep);
  }
}

describe('GET /api/users', () => {
  beforeEach(() => {
    cy.exec('npx prisma migrate reset --force');
  });
  it('gets list of users', () => {
    cy.request('GET', '/api/users').then((response: Cypress.Response<any>) => defaultGetUserChecks(response));
  });
  it('send random data in request', () => {
    cy.request('GET', '/api/users?hello=world').then((response: Cypress.Response<any>) => defaultGetUserChecks(response));
  });

});

export {};
