function Navbar({ currentPage, onNavigate }) {
  const items = [
    { key: 'home', label: 'Home' },
    { key: 'upload', label: 'Upload' },
    { key: 'chat', label: 'Chat' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'revision', label: 'Revision' },
    { key: 'prediction', label: 'Prediction' },
  ];

  return (
    <header
      style={{
        borderBottom: '1px solid #e5e7eb',
        padding: '0.75rem 1rem',
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}
    >
      <nav
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        {items.map((item) => {
          const active = currentPage === item.key;
          return (
            <button
              key={item.key}
              type="button"
              onClick={() => onNavigate(item.key)}
              style={{
                padding: '0.5rem 0.8rem',
                borderRadius: '8px',
                border: active ? '1px solid #1d4ed8' : '1px solid #d1d5db',
                background: active ? '#dbeafe' : '#ffffff',
                color: '#111827',
                cursor: 'pointer',
                fontSize: '0.95rem',
              }}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

export default Navbar;
