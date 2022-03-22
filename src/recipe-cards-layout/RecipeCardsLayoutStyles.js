import styled from "@mui/material/styles/styled";


export const RecipeCardsLayoutWrap = styled('div')`
  width: 1024px;
  margin: 0 auto;

  .cards {
    &.loaded {
      display: grid;
      grid-template-columns: auto auto auto;
      grid-gap: 25px;
    }

    &.isLoading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
  }

  .button-wrap {
    margin: 24px 0;
    display: flex;
    justify-content: center;
  }
`;
