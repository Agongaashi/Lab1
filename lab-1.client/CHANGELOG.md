This file explains how Visual Studio created the project.

The following tools were used to generate this project:
- create-vite

The following steps were used to generate this project:
- Create react project with create-vite: `npm init --yes vite@latest lab-1.client -- --template=react`.
- Update `vite.config.js` to set up proxying and certs.
- Update `App` component to fetch and display weather information.
- Create project file (`lab-1.client.esproj`).
- Create `launch.json` to enable debugging.
- Add project to solution.
- Update proxy endpoint to be the backend server endpoint.
- Add project to the startup projects list.
- Write this file.
