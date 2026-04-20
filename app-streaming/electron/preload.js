import { contextBridge } from 'electron'

contextBridge.exposeInMainWorld('controlRoom', {
  getRuntimeInfo: () => ({
    appName: 'Control Room',
    platform: process.platform,
    mode: 'prototype',
  }),
})
