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
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
const sqlite3 = __importStar(require("sqlite3"));
let mainWindow = null;
let db;
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools(); // Geliştirme sırasında hata ayıklama için
}
function initDatabase() {
    const dbPath = path.join(electron_1.app.getPath('userData'), 'database.sqlite');
    console.log('Database path:', dbPath);
    // Veritabanını oluştur veya bağlan
    db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Database connection error:', err);
            return;
        }
        console.log('Connected to database successfully');
        // İşlemleri sıralı (serialize) olarak yap
        db.serialize(() => {
            // Trips tablosunu oluştur
            db.run(`CREATE TABLE IF NOT EXISTS trips (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT NOT NULL,
        price REAL NOT NULL,
        type TEXT NOT NULL DEFAULT 'go',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
                if (err) {
                    console.error('Error creating trips table:', err);
                }
                else {
                    console.log('Trips table created or already exists');
                }
            });
            // Settings tablosunu oluştur
            db.run(`CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )`, (err) => {
                if (err) {
                    console.error('Error creating settings table:', err);
                }
                else {
                    console.log('Settings table created or already exists');
                    // Tablolar oluşturulduktan sonra varsayılan değerleri ekle
                    db.get("SELECT value FROM settings WHERE key = 'defaultPrice'", (err, row) => {
                        if (err) {
                            console.error('Error checking for default price:', err);
                        }
                        else if (!row) {
                            // Varsayılan değer yoksa ekle
                            db.run("INSERT INTO settings (key, value) VALUES ('defaultPrice', '10')", (err) => {
                                if (err) {
                                    console.error('Error inserting default price:', err);
                                }
                                else {
                                    console.log('Default price setting inserted');
                                }
                            });
                        }
                        else {
                            console.log('Default price setting already exists');
                        }
                    });
                }
            });
        });
    });
}
// IPC işleyicileri
electron_1.ipcMain.handle('get-trips', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Fetching all trips');
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM trips ORDER BY date DESC", (err, rows) => {
            if (err) {
                console.error('Error fetching trips:', err);
                reject(err);
                return;
            }
            console.log(`Found ${rows.length} trips`);
            resolve(rows);
        });
    });
}));
electron_1.ipcMain.handle('add-trip', (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { date, price, type } = args;
    console.log(`Adding trip: ${date}, ${price}, ${type}`);
    return new Promise((resolve, reject) => {
        db.run("INSERT INTO trips (date, price, type) VALUES (?, ?, ?)", [date, price, type], function (err) {
            if (err) {
                console.error('Error adding trip:', err);
                reject(err);
                return;
            }
            console.log(`Trip added with ID: ${this.lastID}`);
            resolve(this.lastID);
        });
    });
}));
electron_1.ipcMain.handle('delete-trip', (_, id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Deleting trip with ID: ${id}`);
    return new Promise((resolve, reject) => {
        db.run("DELETE FROM trips WHERE id = ?", [id], function (err) {
            if (err) {
                console.error('Error deleting trip:', err);
                reject(err);
                return;
            }
            console.log(`Deleted ${this.changes} trip(s)`);
            resolve(this.changes);
        });
    });
}));
electron_1.ipcMain.handle('get-setting', (_, key) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Fetching setting: ${key}`);
    return new Promise((resolve, reject) => {
        db.get("SELECT value FROM settings WHERE key = ?", [key], (err, row) => {
            if (err) {
                console.error(`Error fetching setting ${key}:`, err);
                reject(err);
                return;
            }
            console.log(`Setting ${key} value:`, row ? row.value : null);
            resolve(row ? row.value : null);
        });
    });
}));
electron_1.ipcMain.handle('set-setting', (_, args) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value } = args;
    console.log(`Setting ${key} to ${value}`);
    return new Promise((resolve, reject) => {
        db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value], function (err) {
            if (err) {
                console.error(`Error setting ${key}:`, err);
                reject(err);
                return;
            }
            console.log(`Setting ${key} updated successfully`);
            resolve(this.lastID);
        });
    });
}));
electron_1.app.whenReady().then(() => {
    initDatabase();
    createWindow();
    electron_1.app.on('activate', () => {
        if (electron_1.BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('before-quit', () => {
    if (db) {
        console.log('Closing database connection...');
        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            }
            else {
                console.log('Database connection closed successfully');
            }
        });
    }
});
//# sourceMappingURL=main.js.map