import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 5;

  const searchBooks = async () => {
    if (!query) {
      alert('Please enter a search term.');
      return;
    }

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setResults(data.docs);
      setCurrentPage(1); 
    } catch (error) {
      console.error('Error fetching book data:', error);
    }
  };

  const currentResults = results.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  const totalPages = Math.ceil(results.length / resultsPerPage);

  return (
    <div className="App">
      <header className="navbar">
        <h1>Book Search App</h1>
        <nav>
          <ul>
            <li>Home</li>
            <li>Books</li>
          </ul>
        </nav>
      </header>

      <main className="main-content">
        <div className="search-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books..."
            className="search-input"
          />
          <button onClick={searchBooks} className="search-button">Search</button>
        </div>

        <div className="results">
          {currentResults.length === 0 ? (
            <p>No books found, try searching for some...</p>
          ) : (
            <div className="books-grid">
              {currentResults.map((book, index) => (
                <div key={index} className="book">
                  <img
                    src={
                      book.cover_i
                        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
                        : 'https://via.placeholder.com/150'
                    }
                    alt={book.title}
                    className="book-cover"
                  />
                  <h2>{book.title}</h2>
                  {book.author_name && (
                    <p>
                      <strong>Author:</strong> {book.author_name.join(', ')}
                    </p>
                  )}
                  {book.first_publish_year && (
                    <p>
                      <strong>Published:</strong> {book.first_publish_year}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          
          {results.length > resultsPerPage && (
            <div className="pagination">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="pagination-button"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="pagination-button"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
