import { Clock } from 'lucide-react';

const SearchHistory = ({ history, onSelect }) => {
  if (!history || history.length === 0) return null;

  return (
    <div className="search-history">
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#6b7280' }}>
        <Clock size={14} /> Recent:
      </div>
      {history.map((city, idx) => (
        <button 
          key={idx} 
          className="history-pill"
          onClick={() => onSelect(city)}
        >
          {city}
        </button>
      ))}
    </div>
  );
};

export default SearchHistory;
