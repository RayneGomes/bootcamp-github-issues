import React from 'react';

import { PaginationButons } from './styles';

function Pagination({ page, onClick }) {
  return (
    <PaginationButons>
      <li>
        <button
          type="button"
          value="back"
          disabled={page < 2}
          onClick={onClick('back')}
        >
          Previous
        </button>
      </li>
      <li>
        <span>Página {page}</span>
      </li>
      <li>
        <button type="button" value="next" onClick={onClick('next')}>
          Next
        </button>
      </li>
    </PaginationButons>
  );
}

Pagination.defaultProps = {
  page: 1,
};

export default Pagination;
