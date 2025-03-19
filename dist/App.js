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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Calendar_1 = __importDefault(require("./components/Calendar"));
const Settings_1 = __importDefault(require("./components/Settings"));
require("./App.css");
function App() {
    const [trips, setTrips] = (0, react_1.useState)([]);
    const [defaultPrice, setDefaultPrice] = (0, react_1.useState)(10);
    const [showSettings, setShowSettings] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadTrips();
        loadSettings();
    }, []);
    const loadTrips = () => __awaiter(this, void 0, void 0, function* () {
        const { ipcRenderer } = window.require('electron');
        const trips = yield ipcRenderer.invoke('get-trips');
        setTrips(trips);
    });
    const loadSettings = () => __awaiter(this, void 0, void 0, function* () {
        const { ipcRenderer } = window.require('electron');
        const price = yield ipcRenderer.invoke('get-setting', 'defaultPrice');
        if (price) {
            setDefaultPrice(parseFloat(price));
        }
    });
    const handleDateClick = (date) => __awaiter(this, void 0, void 0, function* () {
        const { ipcRenderer } = window.require('electron');
        yield ipcRenderer.invoke('add-trip', { date, price: defaultPrice });
        loadTrips();
    });
    const handlePriceChange = (newPrice) => __awaiter(this, void 0, void 0, function* () {
        const { ipcRenderer } = window.require('electron');
        yield ipcRenderer.invoke('set-setting', { key: 'defaultPrice', value: newPrice.toString() });
        setDefaultPrice(newPrice);
    });
    const totalMonthlyExpense = trips.reduce((sum, trip) => {
        const tripDate = new Date(trip.date);
        const now = new Date();
        if (tripDate.getMonth() === now.getMonth() && tripDate.getFullYear() === now.getFullYear()) {
            return sum + trip.price;
        }
        return sum;
    }, 0);
    return (react_1.default.createElement("div", { className: "App" },
        react_1.default.createElement("header", { className: "App-header" },
            react_1.default.createElement("h1", null, "Gidi\u015F-D\u00F6n\u00FC\u015F Takip"),
            react_1.default.createElement("button", { onClick: () => setShowSettings(!showSettings) }, "Ayarlar")),
        showSettings && (react_1.default.createElement(Settings_1.default, { defaultPrice: defaultPrice, onPriceChange: handlePriceChange, onClose: () => setShowSettings(false) })),
        react_1.default.createElement("div", { className: "monthly-summary" },
            react_1.default.createElement("h2", null,
                "Ayl\u0131k Toplam: ",
                totalMonthlyExpense.toFixed(2),
                " TL")),
        react_1.default.createElement(Calendar_1.default, { trips: trips, onDateClick: handleDateClick })));
}
exports.default = App;
//# sourceMappingURL=App.js.map