import styled from "@mui/material/styles/styled";

export const DialogForm = styled('form')`
  .short-inputs {
    display: flex;
    flex-direction: column;
    margin: 2.25rem 0;
    gap: 2.25rem;
  }

  @media (min-width: 640px) {
    .short-inputs {
      flex-direction: row;
    }
  }
`;
