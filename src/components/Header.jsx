export default function Header({ darkMode, onToggleTheme }) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <span className="logo">汉</span>
        <div>
          <h1>Learn Hanyu</h1>
          <p className="subtitle">Flashcard tiếng Trung cá nhân</p>
        </div>
      </div>
      <button
        type="button"
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label="Đổi theme"
      >
        {darkMode ? '☀️' : '🌙'}
      </button>
    </header>
  );
}
