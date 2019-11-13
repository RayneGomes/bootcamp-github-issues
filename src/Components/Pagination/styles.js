import styled from 'styled-components';

export const PaginationButons = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  li {
    display: flex;
    flex-direction: column;
    align-items: center;

    span {
      color: #999;
      font-weight: bold;
      font-size: 13px;
    }

    button {
      padding: 5px 10px;
      text-transform: uppercase;
      border-radius: 4px;
      margin: 0 5px;
      color: #666;
      font-weight: 600;
    }

    button[disabled] {
      background-color: #ccc;
      color: #999;
      border-color: #ccc;
      cursor: not-allowed;
    }
  }
`;
