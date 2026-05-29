import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { app, BrowserWindow, Menu } from 'electron'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const isDev = !app.isPackaged
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')


ipcMain.on('abrir-ajustes-emision', () => {
  const ventanaAjustes = new BrowserWindow({
    width: 600,
    height: 500,
    title: "Ajustes de Emisión",
    autoHideMenuBar: true, // Oculta la barra de menú típica de las ventanas
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })  

  if (process.env.VITE_DEV_SERVER_URL) {
    ventanaAjustes.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/CamaraConfig`)
  } else {ventanaAjustes.loadFile(path.join(__dirname, '../dist/index.html'), { hash: 'CamaraConfig' })
  }
})

function createWindow() {
  let mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1100,
    minHeight: 700,
    title: 'Control Room',
    autoHideMenuBar: true,
    backgroundColor: '#07111c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  })

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'))
  }

  Menu.setApplicationMenu(null)
}

function createAddCamWindow() {
  const addCamWindow = new BrowserWindow({
    width: 800,
    height: 600,
    minWidth: 400,
    minHeight: 300,
    title: 'Agregar Cámara'
  })
}
app.whenReady().then(() => {
  createWindow()



  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
