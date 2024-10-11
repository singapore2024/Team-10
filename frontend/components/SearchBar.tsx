import { useState } from 'react';
import Fuse from 'fuse.js'; // Import fuse.js for fuzzy search
import { IProduct } from '../@types/IProduct';
import styles from '../styles/SearchBar.module.scss';

interface SearchBarProps {
  products: IProduct[];
  setFilteredResults: (results: IProduct[]) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ products, setFilteredResults }) => {
  const [query, setQuery] = useState('');

  // Fuse.js configuration for semantic search
  const fuse = new Fuse(products, {
    keys: ['name', 'description', 'type'], // Fields in products to search in
    threshold: 0.5, // Adjust fuzziness (0 = perfect match, 1 = anything matches)
    distance: 100, // Max distance between matching characters (higher is more lenient)
    minMatchCharLength: 2, // Minimum characters to match
    includeScore: true, 
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (query.trim()) {
      const results = fuse.search(query); // Perform fuzzy search
      const filtered = results.map((result) => result.item); // Extract product objects
      setFilteredResults(filtered); // Update filtered products
    } else {
      setFilteredResults(products); // Reset to all products if query is empty
    }
  };

  return (
    <form className={styles.searchForm} onSubmit={handleSearch}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products..."
        className={styles.searchInput}
      />
      <button type="submit" className={styles.searchButton}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
