import styled from "@mui/material/styles/styled";

export const RecipeCardWrap = styled('div')`
  .list-header {
    margin-top: 15px;
    margin-bottom: 5px;
    font-weight: 600;
  }
  
  .list {
    padding: 10px;
    background-color: rgba(112,171,240,.1);
    border-radius: 4px;
    list-style-type: none;
  }
  
  .list-item {
    &:not(:last-child) {
      margin-bottom: 5px;

      &::first-letter {
        text-transform: uppercase;
      }
    }
  }
  
  .cook-time {
    margin-top: 16px;
  }
  
  .label {
    font-weight: 600;
  }
`;
