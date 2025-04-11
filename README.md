# KeyCrop
A virtual greenhouse game for learning VSCode hotkeys

## Setting up

1. Before playing the game, you will need to customize your VSCode `keybindings.json` file. You can find this file in VSCode using **cmd+shift+p** and searching for "Preferences: Open Keyboard Shortcuts (JSON)". You can also go to the file directly: on mac, you can find the file at `~/Library/Application Support/Code/User/keybindings.json`, and on Linux, you can find it at `~/.config/Code/User/keybindings.json`. 

2. Replace the contents of the file with the contents of the `player_resources/keybindings.json` file in this repo.  

### Setting up in the VSCode Extension Development Environment ##

3. Clone this repository and open it in VSCode. In the `keycrop/` directory, run `yarn install` (I used yarn but you could try `npm` as well).

4. Run `yarn run compile`.

5. Open `src/extension.ts`. Select the debugger arrow from the side panel and then clicking the "Run and Debug" button, or use **cmd+shift+p** and search for "Debug: Start debugging". The first time you do this, you will be prompted to select a debugging environment - choose "VSCode Extension Development (preview)". 

6. A new, development-version of VSCode should now pop-up. KeyCrop should appear as a collapsable view in the side panel. 

