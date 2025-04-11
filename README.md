# KeyCrop

## Setting up

1. Before playing the game, you will need to customize your VSCode `keybindings.json` file. You can find this file in VSCode using **cmd+shift+p** and searching for "Preferences: Open Keyboard Shortcuts (JSON)". You can also go to the file directly: on mac, you can find the file at `~/Library/Application Support/Code/User/keybindings.json`, and on Linux, you can find it at `~/.config/Code/User/keybindings.json`. 

2. Replace the contents of the file with the contents of the `player_resources/keybindings.json` file in this repo.  

### Setting up in the VSCode Extension Development Environment ##

3. Clone this repository and open it in VSCode. In the `keycrop/` directory, run `yarn install` (I used yarn but you could try `npm` as well).

4. Run `yarn run compile`.

5. Open `src/extension.ts`. Select the debugger arrow from the side panel and then clicking the "Run and Debug" button, or use **cmd+shift+p** and search for "Debug: Start debugging". The first time you do this, you will be prompted to select a debugging environment - choose "VSCode Extension Development (preview)". 

6. A new, development-version of VSCode should now pop-up. KeyCrop should appear as a collapsable view in the side panel. 

## Study Instructions


### Day One:
1. Fill out the consent form [LINK], followed by the Pre-Survey [LINK].
2. Switch your branch of KeyCrop to `866-study` using `git checkout 866-study` or your preferred Git GUI.
3. Repeat Step 1 of the setup, that is, update your personal `keybindings.json` file by copying the new `player-resources/keybindings.json`.  
4. Re-run `yarn run compile`. 
5. Repeat Steps 4&5 of the Setup Instructions, that is, run the development version of VSCode. 
6. In the development version of VSCode, with keycrop running, open the folder in the 866-study branch called "study-tasks".
7. In the study-tasks folder, `pip install pygame`. 
8. You will see five tasks. Each is a simple game written in python - but unfortunately, the games are not working. Try to use the hotkeys suggested by KeyCrop to debug the games. You can search each file for the word "HINT" for additional clues. 
9. While it is theoretically possible to complete Level One of KeyCrop by debugging the games, please keep in mind that you are under no pressure to do so as a study participant. Also, you are encouraged to attempt to debug each script but if you need to stop due to time limitations or getting stuck that is perfectly OK.
10. The game will create a file called `plants.json` [FULL APPLICATION PATH OR CHANGE STORAGE PATH] in your local VSCode application storage. Please send this file to hermana@usask.ca.

### Day Two:
1. At some point on the second day, fill out this Memory Test [LINK]. 

### Day Three:
1. Switch your branch of KeyCrop to `866-study-nongame-mode` using `git checkout 866-study` or your preferred Git GUI. 
2. Re-run `yarn run compile`. 
3. Repeat Steps 4&5 of the Setup Instructions, that is, run the development version of VSCode. You will still see the VSCode Panel, but it should be blacked out and the game should not be visible. 
4. Repeat the study tasks - debug each of the five games. The games, and their bugs, will be the same as the first day.
5. KeyCrop will create a file called `keytracking.json` in the background. Please send this file to hermana@usask.ca - we can also schedule your PlayTesting Interview.

### Playtesting Interview
1. This interview will take place over Zoom. You will be asked open-ended questions about the game and have an opportunity to provide suggestions as well as any thoughts you have that were not covered by the surveys. 