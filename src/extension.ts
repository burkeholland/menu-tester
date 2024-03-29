// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

class MyDataProvider implements vscode.TreeDataProvider<string> {
	getTreeItem(element: string): vscode.TreeItem {
		return new vscode.TreeItem(element);
	}

	getChildren(element?: string): Thenable<string[]> {
		if (element) {
			return Promise.resolve([]);
		} else {
			const currentFolderPath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
			if (currentFolderPath) {
				const files = fs.readdirSync(currentFolderPath);
				const tsFiles = files.filter(file => path.extname(file) === '.md');
				return Promise.resolve(tsFiles);
			} else {
				return Promise.resolve([]);
			}
		}
	}
}

export function activate(context: vscode.ExtensionContext) {
	let dataProvider = new MyDataProvider();
	vscode.window.registerTreeDataProvider('myCustomView', dataProvider);

	let disposable = vscode.commands.registerCommand('fileUtils.showFile', async (fileName) => {
		// Your command logic here

		try {
			let fileUri = vscode.Uri.file(`${vscode.workspace.workspaceFolders?.[0]?.uri.fsPath}/${fileName}`);
			vscode.commands.executeCommand('revealFileInOS', fileUri);
		}
		catch {
			vscode.window.showErrorMessage("Error opening file");
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
