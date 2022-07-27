const {contextBridge, ipcRenderer} = require('electron');

contextBridge.exposeInMainWorld('electronApi', {
	selectFolder: () => ipcRenderer.invoke('dialog:openDirectory')
});