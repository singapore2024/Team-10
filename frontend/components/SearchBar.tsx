import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/SearchBar.module.scss'; // Adjust based on your project structure

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (query) {
      try {
        const response = await fetch(`/api/search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });

        const data = await response.json();

        if (data.results) {
          console.log(data.results); // Handle search results
        }
      } catch (error) {
        console.error('Error performing search:', error);
      }
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
