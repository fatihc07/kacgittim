import React, { useState } from 'react';

interface SettingsProps {
  defaultPrice: number;
  onPriceChange: (price: number) => void;
  onClose: () => void;
}

const Settings: React.FC<SettingsProps> = ({ defaultPrice, onPriceChange, onClose }) => {
  const [price, setPrice] = useState(defaultPrice);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPriceChange(price);
    onClose();
  };

  return (
    <div className="settings-modal">
      <div className="settings-content">
        <h2>Ayarlar</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="defaultPrice">Varsayılan Ücret (TL):</label>
            <input
              type="number"
              id="defaultPrice"
              value={price}
              onChange={(e) => setPrice(parseFloat(e.target.value))}
              min="0"
              step="0.01"
            />
          </div>
          <div className="button-group">
            <button type="submit">Kaydet</button>
            <button type="button" onClick={onClose}>İptal</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings; 