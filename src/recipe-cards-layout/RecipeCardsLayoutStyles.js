import styled from "@mui/material/styles/styled";


export const RecipeCardsLayoutWrap = styled('div')`
  margin: 0 auto;

  .cards {
    width: 100%;
    
    &.loaded {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 3rem;
    }

    &.isLoading {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
    }
    
    & > div {
      width: 300px;
    }
  }

  .button-wrap {
    margin: 24px 0;
    display: flex;
    justify-content: center;
  }

  @media (min-width: 640px) {
    .cards.loaded {
      gap: 2.5rem;
    }
  }

  @media (min-width: 768px) {
    .cards.loaded {
      flex-direction: row;
      flex-wrap: wrap;
    }

    .cards > div {
      width: 320px;
      margin-bottom: initial;
    }
  }

  @media (min-width: 1024px) {
    
  }

  @media (min-width: 1536px) {
    
  }
`;

