"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Calendar = ({ trips, onDateClick }) => {
    const [currentDate, setCurrentDate] = (0, react_1.useState)(new Date());
    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };
    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };
    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };
    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };
    const handleDateClick = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        onDateClick(date.toISOString().split('T')[0]);
    };
    const hasTrip = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        return trips.some(trip => trip.date === date);
    };
    const getTripPrice = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toISOString().split('T')[0];
        const trip = trips.find(trip => trip.date === date);
        return trip ? trip.price : null;
    };
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const monthNames = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    return (react_1.default.createElement("div", { className: "calendar" },
        react_1.default.createElement("div", { className: "calendar-header" },
            react_1.default.createElement("button", { onClick: handlePrevMonth }, "<"),
            react_1.default.createElement("h2", null,
                monthNames[currentDate.getMonth()],
                " ",
                currentDate.getFullYear()),
            react_1.default.createElement("button", { onClick: handleNextMonth }, ">")),
        react_1.default.createElement("div", { className: "calendar-grid" },
            react_1.default.createElement("div", { className: "weekday" }, "Pzt"),
            react_1.default.createElement("div", { className: "weekday" }, "Sal"),
            react_1.default.createElement("div", { className: "weekday" }, "\u00C7ar"),
            react_1.default.createElement("div", { className: "weekday" }, "Per"),
            react_1.default.createElement("div", { className: "weekday" }, "Cum"),
            react_1.default.createElement("div", { className: "weekday" }, "Cmt"),
            react_1.default.createElement("div", { className: "weekday" }, "Paz"),
            Array.from({ length: firstDay }, (_, i) => (react_1.default.createElement("div", { key: `empty-${i}`, className: "day empty" }))),
            Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const hasTripOnDay = hasTrip(day);
                const tripPrice = getTripPrice(day);
                return (react_1.default.createElement("div", { key: day, className: `day ${hasTripOnDay ? 'has-trip' : ''}`, onClick: () => handleDateClick(day) },
                    react_1.default.createElement("span", { className: "day-number" }, day),
                    hasTripOnDay && tripPrice && (react_1.default.createElement("span", { className: "trip-price" },
                        tripPrice,
                        " TL"))));
            }))));
};
exports.default = Calendar;
//# sourceMappingURL=Calendar.js.map