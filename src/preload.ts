import { contextBridge, ipcRenderer } from 'electron';

// Electron API'lerini window nesnesine ekle
contextBridge.exposeInMainWorld('electron', {
  ipcRenderer: {
    invoke: (channel: string, ...args: any[]) => ipcRenderer.invoke(channel, ...args),
  },
}); 