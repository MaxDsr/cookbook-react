import styled from "@mui/material/styles/styled";

export default styled('div')`
  .custom-list-item {
    position: relative;
    &:before {
      position: absolute;
      top: 6px;
      left: 2px;
      border-radius: 50%;
      background-color: gray;
      width: 10px;
      height: 10px;
      margin-right: 10px;
      display: inline-block;
      vertical-align: middle;
      content: '';
    }
  }
`;
