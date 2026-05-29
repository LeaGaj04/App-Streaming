const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  abrirVentanaAjustes: () => ipcRenderer.send('abrir-ajustes-emision')
})

