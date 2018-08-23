const electron = require("electron");
const { app, BrowserWindow, Menu, ipcMain } = electron;

let mainWindow;
let addwindow;

app.on("ready", () => {
	mainWindow = new BrowserWindow({});
	mainWindow.loadURL(`file://${__dirname}/main.html`);
	mainWindow.on("closed", () => app.quit());

	const mainMenu = Menu.buildFromTemplate(menuTemplate);
	Menu.setApplicationMenu(mainMenu);
});

function createAddWindow() {
	addWindow = new BrowserWindow({
		width: 300,
		height: 200,
		frame: false,
		title: "Add New Todo"
	});
	addWindow.loadURL(`file://${__dirname}/add.html`);
	// Set window to null so js handles garbage collection
	addWindow.on('closed', () => addWindow = null);
}

ipcMain.on("todo:add", (event, todo) => {
	mainWindow.webContents.send("todo:add", todo);
	addWindow.close();
});

const menuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "New Todo",
				accelerator: "CmdOrCtrl+N",
				click() {
					createAddWindow();
				}
			},
			{
				label: "Quit",
				accelerator: "CmdOrCtrl+Q",
				click() {
					app.quit();
				}
			}
		]
	}
];

if (process.platform === "darwin") {
	menuTemplate.unshift({});
}

if (process.env.NODE_ENV !== "production") {
	// production, development, staging, or test
	menuTemplate.push({
		label: "Developer",
		submenu: [
			{
				label: "Toggle Developer Tools",
				accelerator:
					process.platform === "darwin"
						? "Cmd+Alt+I"
						: "Ctrl+Shift+I",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			}
		]
	});
}
