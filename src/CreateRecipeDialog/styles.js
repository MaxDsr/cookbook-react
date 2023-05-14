import styled from "@mui/material/styles/styled";

export default styled('form')`
  .short-inputs {
    display: flex;
    flex-direction: column;
    margin: 2.25rem 0;
    gap: 2.25rem;
  }

  .input-wrap {
    margin-bottom: 1rem;

    img {
      height: 20px;
      width: 20px;
      cursor: pointer;
      margin-left: 0.9rem;
      margin-top: 0.58rem;
    }

    .Mui-error {
      margin-left: 0;
    }
  }

  @media (min-width: 640px) {
    .short-inputs {
      flex-direction: row;
    }
  }
`;
