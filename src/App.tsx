import React, { useState, useEffect } from 'react';
import Calendar from './components/Calendar';
import Settings from './components/Settings';
import './App.css';

// Electron API için TypeScript arayüzü
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke(channel: string, ...args: any[]): Promise<any>;
      };
    };
  }
}

interface Trip {
  id: number;
  date: string;
  price: number;
  type: 'go' | 'return'; // Tip ekledim
}

function App() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [defaultPrice, setDefaultPrice] = useState<number>(10);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [monthlyTotal, setMonthlyTotal] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());

  useEffect(() => {
    loadTrips();
    loadSettings();
  }, []);

  // trips değiştiğinde veya seçilen ay değiştiğinde monthly total'ı güncelle
  useEffect(() => {
    calculateMonthlyTotal();
  }, [trips, selectedMonth]);

  const loadTrips = async () => {
    try {
      const loadedTrips = await window.electron.ipcRenderer.invoke('get-trips');
      console.log('Yüklenen seyahatler:', loadedTrips);
      setTrips(loadedTrips);
    } catch (error) {
      console.error('Seyahatler yüklenirken hata oluştu:', error);
    }
  };

  const loadSettings = async () => {
    try {
      const price = await window.electron.ipcRenderer.invoke('get-setting', 'defaultPrice');
      if (price) {
        setDefaultPrice(parseFloat(price));
      }
    } catch (error) {
      console.error('Ayarlar yüklenirken hata oluştu:', error);
    }
  };

  const calculateMonthlyTotal = () => {
    const selectedMonthIndex = selectedMonth.getMonth();
    const selectedYear = selectedMonth.getFullYear();
    
    let total = 0;
    trips.forEach(trip => {
      const tripDate = new Date(trip.date);
      if (tripDate.getMonth() === selectedMonthIndex && tripDate.getFullYear() === selectedYear) {
        total += Number(trip.price);
      }
    });
    
    console.log('Hesaplanan aylık toplam:', total);
    setMonthlyTotal(total);
  };

  const handleDateClick = async (date: string, type: 'go' | 'return') => {
    try {
      await window.electron.ipcRenderer.invoke('add-trip', { date, price: defaultPrice, type });
      await loadTrips(); // Ekleme sonrası verileri yeniden yükle
    } catch (error) {
      console.error('Seyahat eklenirken hata oluştu:', error);
    }
  };

  const handleDeleteTrip = async (id: number) => {
    try {
      await window.electron.ipcRenderer.invoke('delete-trip', id);
      await loadTrips(); // Silme sonrası verileri yeniden yükle
    } catch (error) {
      console.error('Seyahat silinirken hata oluştu:', error);
    }
  };

  const handlePriceChange = async (newPrice: number) => {
    try {
      await window.electron.ipcRenderer.invoke('set-setting', { key: 'defaultPrice', value: newPrice.toString() });
      setDefaultPrice(newPrice);
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata oluştu:', error);
    }
  };
  
  const handleMonthChange = (date: Date) => {
    setSelectedMonth(date);
  };
  
  // Seçili ayın adını al
  const getMonthName = (date: Date) => {
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return monthNames[date.getMonth()];
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gidiş-Dönüş Takip</h1>
        <button onClick={() => setShowSettings(!showSettings)}>Ayarlar</button>
      </header>
      
      {showSettings && (
        <Settings
          defaultPrice={defaultPrice}
          onPriceChange={handlePriceChange}
          onClose={() => setShowSettings(false)}
        />
      )}

      <div className="monthly-summary">
        <h2>{getMonthName(selectedMonth)} {selectedMonth.getFullYear()} Toplam: {monthlyTotal.toFixed(2)} TL</h2>
      </div>

      <Calendar
        trips={trips}
        onDateClick={handleDateClick}
        onDeleteTrip={handleDeleteTrip}
        onMonthChange={handleMonthChange}
      />
    </div>
  );
}

export default App; 