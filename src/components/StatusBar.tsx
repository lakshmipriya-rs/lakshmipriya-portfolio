export function StatusBar() {
  return (
    <footer className="status-bar">
      <p>
        <i className="status-dot" aria-hidden="true" />
        <span>
          status: open to work <span className="status-sep">|</span> open to
          relocate
        </span>
      </p>
    </footer>
  );
}
