import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import * as sqlite3 from 'sqlite3';

let mainWindow: BrowserWindow | null = null;
let db: sqlite3.Database;

function createWindow() {
  mainWindow = new BrowserWindow({
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
  const dbPath = path.join(app.getPath('userData'), 'database.sqlite');
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
        } else {
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
        } else {
          console.log('Settings table created or already exists');
          
          // Tablolar oluşturulduktan sonra varsayılan değerleri ekle
          db.get("SELECT value FROM settings WHERE key = 'defaultPrice'", (err, row: any) => {
            if (err) {
              console.error('Error checking for default price:', err);
            } else if (!row) {
              // Varsayılan değer yoksa ekle
              db.run("INSERT INTO settings (key, value) VALUES ('defaultPrice', '10')", (err) => {
                if (err) {
                  console.error('Error inserting default price:', err);
                } else {
                  console.log('Default price setting inserted');
                }
              });
            } else {
              console.log('Default price setting already exists');
            }
          });
        }
      });
    });
  });
}

// IPC işleyicileri
ipcMain.handle('get-trips', async () => {
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
});

ipcMain.handle('add-trip', async (_, args: { date: string, price: number, type: string }) => {
  const { date, price, type } = args;
  console.log(`Adding trip: ${date}, ${price}, ${type}`);
  
  return new Promise((resolve, reject) => {
    db.run("INSERT INTO trips (date, price, type) VALUES (?, ?, ?)", 
      [date, price, type], function(err) {
      if (err) {
        console.error('Error adding trip:', err);
        reject(err);
        return;
      }
      console.log(`Trip added with ID: ${this.lastID}`);
      resolve(this.lastID);
    });
  });
});

ipcMain.handle('delete-trip', async (_, id: number) => {
  console.log(`Deleting trip with ID: ${id}`);
  
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM trips WHERE id = ?", [id], function(err) {
      if (err) {
        console.error('Error deleting trip:', err);
        reject(err);
        return;
      }
      console.log(`Deleted ${this.changes} trip(s)`);
      resolve(this.changes);
    });
  });
});

ipcMain.handle('get-setting', async (_, key: string) => {
  console.log(`Fetching setting: ${key}`);
  
  return new Promise((resolve, reject) => {
    db.get("SELECT value FROM settings WHERE key = ?", [key], (err, row: any) => {
      if (err) {
        console.error(`Error fetching setting ${key}:`, err);
        reject(err);
        return;
      }
      console.log(`Setting ${key} value:`, row ? row.value : null);
      resolve(row ? row.value : null);
    });
  });
});

ipcMain.handle('set-setting', async (_, args: { key: string, value: string }) => {
  const { key, value } = args;
  console.log(`Setting ${key} to ${value}`);
  
  return new Promise((resolve, reject) => {
    db.run("INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)", [key, value], function(err) {
      if (err) {
        console.error(`Error setting ${key}:`, err);
        reject(err);
        return;
      }
      console.log(`Setting ${key} updated successfully`);
      resolve(this.lastID);
    });
  });
});

app.whenReady().then(() => {
  initDatabase();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (db) {
    console.log('Closing database connection...');
    db.close((err) => {
      if (err) {
        console.error('Error closing database:', err);
      } else {
        console.log('Database connection closed successfully');
      }
    });
  }
}); 