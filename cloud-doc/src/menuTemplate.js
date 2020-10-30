const { app, shell, ipcMain } = require('electron')
const Store = require('electron-store')
const settingsStore = new Store({ name: 'Settings'})

const qiniuIsConfiged =  ['accessKey', 'secretKey', 'bucketName'].every(key => !!settingsStore.get(key))
let enableAutoSync = settingsStore.get('enableAutoSync')
let template = [{
  label: 'Document',
  submenu: [{
    label: 'New',
    accelerator: 'CmdOrCtrl+N',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('create-new-file')
    }
  },{
    label: 'Save',
    accelerator: 'CmdOrCtrl+S',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('save-edit-file')
    }
  },{
    label: 'Search',
    accelerator: 'CmdOrCtrl+F',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('search-file')
    }
  },{
    label: 'import',
    accelerator: 'CmdOrCtrl+O',
    click: (menuItem, browserWindow, event) => {
      browserWindow.webContents.send('import-file')
    }
  }]
},
{
  label: 'Edit',
  submenu: [
    {
      label: 'undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    }, {
      label: 'redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    }, {
      type: 'separator'
    }, {
      label: 'cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    }, {
      label: 'copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    }, {
      label: 'paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    }, {
      label: 'selectall',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }
  ]
},
{
  label: 'Cloud',
  submenu: [{
    label: 'Setting',
    accelerator: 'CmdOrCtrl+,',
    click: () => {
      ipcMain.emit('open-settings-window')
    }
  }, {
    label: 'Sync',
    type: 'checkbox',
    enabled: qiniuIsConfiged,
    checked: enableAutoSync,
    click: () => {
      settingsStore.set('enableAutoSync', !enableAutoSync)
    }
  }, {
    label: 'Upload to Cloud',
    enabled: qiniuIsConfiged,
    click: () => {
      ipcMain.emit('upload-all-to-qiniu')
    }
  }, {
    label: 'Download to local',
    enabled: qiniuIsConfiged,
    click: () => {
      
    }
  }]
},
{
  label: 'View',
  submenu: [
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.reload();
      }
    },
    {
      label: 'Fullscreen',
      accelerator: (() => {
        if (process.platform === 'darwin')
          return 'Ctrl+Command+F';
        else
          return 'F11';
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
      }
    },
    {
      label: 'DevMode',
      accelerator: (function() {
        if (process.platform === 'darwin')
          return 'Alt+Command+I';
        else
          return 'Ctrl+Shift+I';
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow)
          focusedWindow.toggleDevTools();
      }
    },
  ]
},
{
  label: 'Window',
  role: 'window',
  submenu: [{
    label: 'Minimize',
    accelerator: 'CmdOrCtrl+M',
    role: 'minimize'
  }, {
    label: 'Close',
    accelerator: 'CmdOrCtrl+W',
    role: 'close'
  }]
},
{
  label: 'Help',
  role: 'help',
  submenu: [
    {
      label: 'More',
      click: () => { shell.openExternal('http://electron.atom.io') }
    },
  ]
},
]

if (process.platform === 'darwin') {
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [{
      label: `About ${name}`,
      role: 'about'
    }, {
      type: 'separator'
    }, {
      label: 'Setting',
      accelerator: 'Command+,',
      click: () => {
        ipcMain.emit('open-settings-window')
      }
    }, {
      label: 'Services',
      role: 'services',
      submenu: []
    }, {
      type: 'separator'
    }, {
      label: `Hide ${name}`,
      accelerator: 'Command+H',
      role: 'hide'
    }, {
      label: 'Hideothers',
      accelerator: 'Command+Alt+H',
      role: 'hideothers'
    }, {
      label: 'Unhide',
      role: 'unhide'
    }, {
      type: 'separator'
    }, {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: () => {
        app.quit()
      }
    }]
  })
} else {
  template[0].submenu.push({
    label: 'Setting',
    accelerator: 'Ctrl+,',
    click: () => {
      ipcMain.emit('open-settings-window')
    }
  })
}

module.exports = template