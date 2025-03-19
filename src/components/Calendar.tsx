import React, { useState, useEffect } from 'react';

interface Trip {
  id: number;
  date: string;
  price: number;
  type: 'go' | 'return';
}

interface CalendarProps {
  trips: Trip[];
  onDateClick: (date: string, type: 'go' | 'return') => void;
  onDeleteTrip: (id: number) => void;
  onMonthChange: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ trips, onDateClick, onDeleteTrip, onMonthChange }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
  
  // Yıl seçenekleri - geçen yıldan gelecek 5 yıla kadar
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 1 + i);

  // Notify parent component when month changes
  useEffect(() => {
    onMonthChange(currentDate);
  }, [currentDate, onMonthChange]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };
  
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = parseInt(e.target.value);
    setCurrentDate(new Date(currentDate.getFullYear(), newMonth));
  };
  
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = parseInt(e.target.value);
    setCurrentDate(new Date(newYear, currentDate.getMonth()));
  };

  const handleDateClick = (day: number, type: 'go' | 'return') => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const dateStr = date.toISOString().split('T')[0];
    
    const existingTrip = trips.find(trip => 
      trip.date === dateStr && trip.type === type
    );
    
    if (existingTrip) {
      onDeleteTrip(existingTrip.id);
    } else {
      onDateClick(dateStr, type);
    }
  };

  const hasTrip = (day: number, type: 'go' | 'return') => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    return trips.some(trip => trip.date === date && trip.type === type);
  };

  const getTripPrice = (day: number, type: 'go' | 'return') => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
    const trip = trips.find(trip => trip.date === date && trip.type === type);
    return trip ? trip.price : null;
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={handlePrevMonth}>&lt;</button>
        
        <div className="month-selector">
          <select 
            value={currentDate.getMonth()} 
            onChange={handleMonthChange}
            className="month-select"
          >
            {monthNames.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          
          <select 
            value={currentDate.getFullYear()} 
            onChange={handleYearChange}
            className="year-select"
          >
            {yearOptions.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        
        <button onClick={handleNextMonth}>&gt;</button>
      </div>
      
      <div className="calendar-grid">
        <div className="weekday">Pzt</div>
        <div className="weekday">Sal</div>
        <div className="weekday">Çar</div>
        <div className="weekday">Per</div>
        <div className="weekday">Cum</div>
        <div className="weekday">Cmt</div>
        <div className="weekday">Paz</div>
        
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`empty-${i}`} className="day empty"></div>
        ))}
        
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const hasGoTrip = hasTrip(day, 'go');
          const hasReturnTrip = hasTrip(day, 'return');
          const goTripPrice = getTripPrice(day, 'go');
          const returnTripPrice = getTripPrice(day, 'return');
          
          return (
            <div key={day} className="day">
              <span className="day-number">{day}</span>
              <div className="day-content">
                <div 
                  className={`day-half go ${hasGoTrip ? 'has-trip' : ''}`}
                  onClick={() => handleDateClick(day, 'go')}
                >
                  <span className="trip-label">Gidiş</span>
                  {hasGoTrip && goTripPrice && (
                    <span className="trip-price">{goTripPrice} TL</span>
                  )}
                </div>
                <div 
                  className={`day-half return ${hasReturnTrip ? 'has-trip' : ''}`}
                  onClick={() => handleDateClick(day, 'return')}
                >
                  <span className="trip-label">Dönüş</span>
                  {hasReturnTrip && returnTripPrice && (
                    <span className="trip-price">{returnTripPrice} TL</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar; 