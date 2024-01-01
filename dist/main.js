const { app, BrowserWindow } = require('electron')
const path = require('node:path')


const createWindow = () =>
{ 
	const mainWnd = new BrowserWindow({
		//titleBarStyle: 'hidden',
		titleBarOverlay:
		{
			color: 'black',
			symbolColor: 'white',
		},
		webPreferences:
		{
			nodeIntegration: true,
			preload: path.join(__dirname, 'preload.js'),
			sandbox: false
		},

		autoHideMenuBar: true
	})
	
	mainWnd.maximize();
	mainWnd.loadFile('dist/index.html');
}


app.whenReady().then(() =>
{
	createWindow()

	app.on('activate', () =>
	{
		if (BrowserWindow.getAllWindows().length === 0)
			createWindow()
	})
})



app.on('window-all-closed', () =>
{
	if (process.platform !== 'darwin') app.quit()
})

