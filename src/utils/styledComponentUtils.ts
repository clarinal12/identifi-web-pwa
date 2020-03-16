import styled from 'styled-components';

export const StyledListWrapper = styled.div`
  max-height: 250px;
  overflow: hidden;

  &:hover {
    overflow: auto;
    &::-webkit-scrollbar-thumb {
      display: block;
    }
    .ant-list-item {
      width: calc(100% - 1px);
    }
  }

  /* total width */
  &::-webkit-scrollbar {
    width: 6px !important;
  }

  /* scrollbar itself */
  &::-webkit-scrollbar-thumb {
    background-color: #babac0 !important;
    border-radius: 12px !important;
    border: none !important;
    display: none;
  }

  /* set button(top and bottom of the scrollbar) */
  &::-webkit-scrollbar-button {
    display: none !important;
  }

  .ant-list-item {
    padding: 8px 16px !important;
    &.active {
      border-left: 4px solid #08979C;
      background: #E6FFFB;
      .list-content-wrapper {
        .ant-typography, .anticon-right {
          color: #08979C;
        }
      }
    }
    &:hover {
      cursor: pointer;
      &:not(.active) {
        background: #F5F5F5;
      }
    }
    .list-content-wrapper {
      width: 100%;
      justify-content: space-between;
      align-items: center;
    }
  }
`;
