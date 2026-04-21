export default function SearchBar({ onSearch }) {
    return (
        <input 
            type="text" 
            id="searchInput" 
            placeholder="🔍 Search records..." 
            className="search-bar"
            onChange={(e) => onSearch(e.target.value.toLowerCase())}
        />
    );
}

