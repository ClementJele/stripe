// import React from 'react';
// import styled from 'styled-components';
// import { FaSearch } from 'react-icons/fa';

// const SearchContainer = styled.div`
//   width: 100%;
//   display: flex;
//   justify-content: flex-end;
//   padding: 0;
//   background-color: transparent;
//   gap: 12px;
//   align-items: center;
//   padding: 6px;
// `;

// const SearchInput = styled.input`
//   width: 300px;
//   padding: 0.5rem 1rem;
//   border-radius: 5px;
//   border: none;
//   font-size: 1rem;
//   &:focus {
//     outline: none;
//     border-color: transparent;
//   }
// `;

// const SearchIcon = styled(FaSearch)`
//   font-size: 1.2rem;
//   color: #888;
//   cursor: pointer;
// `;

// const SearchBar = ({ query, setQuery }) => {
//   return (
//     <SearchContainer>
//       <SearchIcon />
//       <SearchInput
//         type="text"
//         placeholder="Search"
//         value={query}
//         onChange={(e) => setQuery(e.target.value)}
//       />
//     </SearchContainer>
//   );
// };

// export default SearchBar;
import React from 'react';
import styled from 'styled-components';
import { FaSearch } from 'react-icons/fa';

const SearchContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  padding: 0;
  background-color: transparent;
  gap: 12px;
  align-items: center;
  padding: 6px;
`;

const SearchInput = styled.input`
  width: 300px;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  border: none;
  font-size: 1rem;
  &:focus {
    outline: none;
    border-color: transparent;
  }
`;

const SearchIcon = styled(FaSearch)`
  font-size: 1.2rem;
  color: #9999999;
  cursor: pointer;
`;

const SearchBar = ({ query = '', setQuery = () => {} }) => {
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
  };

  return (
    <SearchContainer>
      <SearchIcon />
      <SearchInput
        type="text"
        placeholder="Search by name, type, or location..."
        value={query}
        onChange={handleSearch}
      />
    </SearchContainer>
  );
};

export default SearchBar;