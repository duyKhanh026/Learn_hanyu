export default function SearchFilter({
  searchQuery,
  onSearchChange,
  allTags,
  selectedTags,
  onTagToggle,
  onClearTags,
}) {
  return (
    <div className="search-filter">
      <div className="search-box">
        <input
          type="search"
          placeholder="Tìm theo Hanzi, Pinyin, nghĩa..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Tìm kiếm từ vựng"
        />
      </div>

      {allTags.length > 0 && (
        <div className="tag-filters">
          <span className="filter-label">Tags:</span>
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              className={`tag-filter-btn ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => onTagToggle(tag)}
            >
              {tag}
            </button>
          ))}
          {selectedTags.length > 0 && (
            <button type="button" className="clear-tags-btn" onClick={onClearTags}>
              Xóa filter
            </button>
          )}
        </div>
      )}
    </div>
  );
}
