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
const Settings = ({ defaultPrice, onPriceChange, onClose }) => {
    const [price, setPrice] = (0, react_1.useState)(defaultPrice);
    const handleSubmit = (e) => {
        e.preventDefault();
        onPriceChange(price);
        onClose();
    };
    return (react_1.default.createElement("div", { className: "settings-modal" },
        react_1.default.createElement("div", { className: "settings-content" },
            react_1.default.createElement("h2", null, "Ayarlar"),
            react_1.default.createElement("form", { onSubmit: handleSubmit },
                react_1.default.createElement("div", { className: "form-group" },
                    react_1.default.createElement("label", { htmlFor: "defaultPrice" }, "Varsay\u0131lan \u00DCcret (TL):"),
                    react_1.default.createElement("input", { type: "number", id: "defaultPrice", value: price, onChange: (e) => setPrice(parseFloat(e.target.value)), min: "0", step: "0.01" })),
                react_1.default.createElement("div", { className: "button-group" },
                    react_1.default.createElement("button", { type: "submit" }, "Kaydet"),
                    react_1.default.createElement("button", { type: "button", onClick: onClose }, "\u0130ptal"))))));
};
exports.default = Settings;
//# sourceMappingURL=Settings.js.map