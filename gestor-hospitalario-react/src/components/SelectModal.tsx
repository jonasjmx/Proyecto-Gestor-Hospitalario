import React, { useState } from 'react';
import Modal from './Modal';
import SearchBox from './SearchBox';

interface Option {
  id: number;
  label: string;
  [key: string]: any;
}

interface SelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  options: Option[];
  onSelect: (option: Option) => void;
  title?: string;
  labelKey?: string;
}

const SelectModal: React.FC<SelectModalProps> = ({
  isOpen,
  onClose,
  options,
  onSelect,
  title = 'Seleccionar',
  labelKey = 'label',
}) => {
  const [search, setSearch] = useState('');

  const filtered = options.filter(opt =>
    opt[labelKey].toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="medium">
      <div style={{ marginBottom: 16 }}>
        <SearchBox value={search} onChange={setSearch} placeholder="Buscar..." />
      </div>
      <div style={{ maxHeight: 320, overflowY: 'auto' }}>
        {filtered.length === 0 && (
          <div style={{ color: '#888', textAlign: 'center', padding: 24 }}>
            No hay resultados.
          </div>
        )}
        {filtered.map(opt => (
          <button
            key={opt.id}
            className="modal-btn"
            style={{ width: '100%', marginBottom: 8, textAlign: 'left' }}
            onClick={() => { onSelect(opt); onClose(); }}
          >
            {opt[labelKey]}
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default SelectModal;
