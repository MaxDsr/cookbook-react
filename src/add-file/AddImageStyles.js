import styled from "@mui/material/styles/styled";

export const AddFileWrap = styled('div')`
  width: 100%;
  height: 150px;
  border-radius: 2px;
  border: 1px solid #D2D2D2;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  
  .icon {
    position: absolute;
    width: 24px;
    height: 24px;
    right: 10px;
    top: 10px;
    border-radius: 4px;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;

    &:before {
      content: "";
      width: 100%;
      height: 100%;
      background-color: #303030;
      opacity: 0.5;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
    }

    svg {
      z-index: 2;
    }
  }
  
  input[type=file] {
    display: none;
  }
`;
