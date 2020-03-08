/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getText = /* GraphQL */ `
  query GetText($id: ID!) {
    getText(id: $id) {
      id
      text
      email
    }
  }
`;
export const listTexts = /* GraphQL */ `
  query ListTexts(
    $filter: ModeltextFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTexts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        email
      }
      nextToken
    }
  }
`;
