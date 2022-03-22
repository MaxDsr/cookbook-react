import styled from "@mui/material/styles/styled";

export const RecipeCardWrap = styled('div')`
  width: 320px;
`;

export const List = styled('div')`
  padding: 10px;
  background-color: rgba(112,171,240,.1);
  border-radius: 4px;
  list-style-type: none;
`;

export const ListItem = styled('li')`
  &:not(:last-child) {
    margin-bottom: 5px;

    &::first-letter {
      text-transform: uppercase;
    }
  }
`;

export const ListHeader = styled('div')`
  margin-top: 15px;
  margin-bottom: 5px;
  font-weight: 600;
`;

export const CookTime = styled('div')`
  margin-top: 16px
`;

export const Label = styled('span')`
  font-weight: 600;
`;
