const { app, BrowserWindow } = require('electron')
const path = require('node:path')

const createWindow = () => {
  // Create the browser window.
const mainWindow = new BrowserWindow({
	width: 800,
	height: 600,
	webPreferences:
	{
		nodeIntegration: true,
		preload: path.join(__dirname, 'preload.js')
	}
})
  mainWindow.loadFile('index.html')
  
}


app.whenReady().then(() =>
{
  createWindow()

  app.on('activate', () => {
	  if (BrowserWindow.getAllWindows().length === 0)
		  createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () =>
{
  if (process.platform !== 'darwin') app.quit()
})
