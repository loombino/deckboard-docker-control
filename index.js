const { dialog } = require('electron');
const {
	Extension,
    log,
	INPUT_METHOD,
	PLATFORMS,
} = require('deckboard-kit');
const { exec } = require("child_process");

class DockerControl extends Extension {
	constructor() {
		super();
		this.name = 'Docker Control';
		this.platforms = [PLATFORMS.WINDOWS];
		this.configs = {
			dockerPath:{
				type: "text",
				name: "Path to file 'docker.exe'",
				descriptions: "Paste the path to the executable file 'docker.exe' (Clear the value if the path is in the environment variables)",
				value: "C:\\Program Files\\Docker\\Docker\\resources\\bin",
			},
			dockerUserId:{
				type: "text",
				name: "Docker Hub: Username or email address (Optional)",
				descriptions: "The username is required to access the Docker Hub account, but it is not mandatory to enter it",
				value: "",
			},
			dockerUserSecret:{
				type: "password",
				name: "Docker Hub: Password (Optional)",
				descriptions: "The password is required to log into the Docker Hub account, but it is not required to enter it",
				value: "",
			},
		};
		this.inputs = [
			{
				label: 'Start Docker Desktop',
				value: 'start-docker',
				icon: 'power-off',
				fontIcon: 'fas',
				color: '#1c90ed',
				input: []
			},
			{
				label: 'Quit Docker Desktop',
				value: 'quit-docker',
				icon: 'power-off',
				fontIcon: 'fas',
				color: '#1c90ed',
				input: []
			},
			{
				label: 'Start a Container',
				value: 'start-container',
				icon: 'plane-departure',
				fontIcon: 'fas',
				color: '#1c90ed',
				input: [
					{
						label: 'Container name or HASH part',
						ref: 'containerID',
						type: INPUT_METHOD.INPUT_TEXT
					}
				]
			},
			{
				label: 'Stop a Container',
				value: 'stop-container',
				icon: 'plane-arrival',
				fontIcon: 'fas',
				color: '#1c90ed',
				input: [
					{
						label: 'Container name or HASH part',
						ref: 'containerID',
						type: INPUT_METHOD.INPUT_TEXT
					}
				]
			},
			{
				label: 'Restart a Container',
				value: 'restart-container',
				icon: 'redo',
				fontIcon: 'fas',
				color: '#1c90ed',
				input: [
					{
						label: 'Container name or HASH part',
						ref: 'containerID',
						type: INPUT_METHOD.INPUT_TEXT
					}
				]
			},
		];
	}

	// Executes when the extensions loaded every time the app start.
	initExtension() {
		return;
	}

	execute(action, args) {
		switch (action) {
			case 'start-docker':
                if (this.configs.dockerPath != null) {
					console.log(`Starting Docker Desktop...`);
					exec('"' + this.configs.dockerPath.value + '\\..\\..\\Docker Desktop.exe"', (error, stdout, stderr) => {
						console.log(error);
						if (error && error.code != 2) {
							dialog.showMessageBox(
								null,
								{
									type: 'info',
									buttons: [],
									defaultId: 0,
									title: 'Path not found',
									message: '"' + this.configs.dockerPath.value.slice(0, this.configs.dockerPath.value.length-14) + '\\Docker Desktop.exe" not found. Check the path and try again.'
								}
							);
						}
						console.log(`stdout: ${stdout}`);
						console.error(`stderr: ${stderr}`);
					});
				}
				break;
			case 'quit-docker':
				var child = require("child_process").spawn("powershell.exe", ['$isrunning = Get-Process "Docker Desktop" -ErrorAction SilentlyContinue;if ($isrunning) {;$isrunning.CloseMainWindow();$isrunning | Stop-Process -Force;};exit $isrunning;']);
				child.stdout.on("data",function(data){
					console.log("Powershell Data: " + data);
				});
				child.stderr.on("data",function(data){
					console.log("Powershell Errors: " + data);
				});
				child.on("exit",function(){
					console.log("Powershell Script finished");
				});
				child.stdin.end();
				break;
			case 'start-container':
				if (this.configs.dockerPath != null) {
					console.log(`Starting Docker container...` + '"' + this.configs.dockerPath.value + '\\docker.exe" start ' + args.containerID);
					exec('"' + this.configs.dockerPath.value + '\\docker.exe" start ' + args.containerID, (error, stdout, stderr) => {
						if (error) {
							dialog.showMessageBox(
								null,
								{
									type: 'info',
									buttons: [],
									defaultId: 0,
									title: 'Container not found',
									message: 'Container "' + args.containerID + '" not found. Check the name and try again.'
								}
							);
						}
						console.log(`stdout: ${stdout}`);
						console.error(`stderr: ${stderr}`);
					});
				}
				break;
			case 'stop-container':
				if (this.configs.dockerPath != null) {
					console.log(`Stopping Docker container... ` + '"' + this.configs.dockerPath.value + '\\docker.exe" stop ' + args.containerID);
					exec('"' + this.configs.dockerPath.value + '\\docker.exe" stop ' + args.containerID, (error, stdout, stderr) => {
						if (error) {
							dialog.showMessageBox(
								null,
								{
									type: 'info',
									buttons: [],
									defaultId: 0,
									title: 'Container not found',
									message: 'Container "' + args.containerID + '" not found. Check the name and try again.'
								}
							);
						}
						console.log(`stdout: ${stdout}`);
						console.error(`stderr: ${stderr}`);
					});
				}
				break;
			case 'restart-container':
				if (this.configs.dockerPath != null) {
					console.log(`Restarting Docker container...` + '"' + this.configs.dockerPath.value + '\\docker.exe" restart ' + args.containerID);
					exec('"' + this.configs.dockerPath.value + '\\docker.exe" restart ' + args.containerID, (error, stdout, stderr) => {
						if (error) {
							dialog.showMessageBox(
								null,
								{
									type: 'info',
									buttons: [],
									defaultId: 0,
									title: 'Container not found',
									message: 'Container "' + args.containerID + '" not found. Check the name and try again.'
								}
							);
						}
						console.log(`stdout: ${stdout}`);
						console.error(`stderr: ${stderr}`);
					});
				}
				break;
			default:
				break;
		}
	};
}

module.exports = sendData => new DockerControl(sendData);