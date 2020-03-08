/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const match = /* GraphQL */ `
  mutation Match($input: matchInput) {
    match(input: $input) {
      items
    }
  }
`;
export const createText = /* GraphQL */ `
  mutation CreateText(
    $input: CreateTextInput!
    $condition: ModeltextConditionInput
  ) {
    createText(input: $input, condition: $condition) {
      id
      text
      email
    }
  }
`;
export const updateText = /* GraphQL */ `
  mutation UpdateText(
    $input: UpdateTextInput!
    $condition: ModeltextConditionInput
  ) {
    updateText(input: $input, condition: $condition) {
      id
      text
      email
    }
  }
`;
export const deleteText = /* GraphQL */ `
  mutation DeleteText(
    $input: DeleteTextInput!
    $condition: ModeltextConditionInput
  ) {
    deleteText(input: $input, condition: $condition) {
      id
      text
      email
    }
  }
`;
