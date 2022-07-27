const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js')
		}
	});
	
	ipcMain.handle('dialog:openDirectory', async () => {
		const { canceled, filePaths } = await dialog.showOpenDialog(win, {
			properties: ['openDirectory']
		});
		
		if (canceled) {
			return null;
		} else {
			return filePaths && filePaths.length ? filePaths[0] : null;
		}
	});
	
	win.loadFile('./UI/public/index.en.html');
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		}
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});