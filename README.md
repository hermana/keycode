# Keycrop

## How to get the plugin

### 1. Getting the code:

If you are familiar with git, you can clone this repo

``
git clone https://github.com/hermana/keycode.git
``

and checkout this branch:

``
git checkout test-keycrop
``

If you are not familiar with git, click on the green "<> Code" button and select "Download ZIP". This branch of the codebase should download as a zip file. Unzip the file and open it in VSCode. 

### 2. Setting up the keybindings file: 

1. In VSCode, CTRL+SHIFT+P and search "Keyboard" (or similar)
2. Select "Preferences: Open keyboard shortcuts". This should open your keybindings file. 
3. Save your custom keybindings to another file, if you have any, so you can put them back when you are done testing. 
4. In the codebase, `keycrop->player_resources` contains json files with custom keybindings used to play the game. If you are on Windows or Linux, copy the contents of `keybindings.json` and put them in your personal keybindings file. If you are on Mac, copy the contents of `mac-keybindings.json` and put them in your custom keybindings file. 

### 3. Running the plugin in development mode:

1. Open the keycrop codebase in VSCode, if you haven't already. 
2. Navigate to kecrop->src->extension.ts. 
3. In your terminal, `cd` into the `keycrop` directory. 
4. Run `yarn install` or `npm install`.
5. Run `yarn compile` or `npm run compile`. 
6. Select "Run and Debug" (CTRL+SHIFT+D). 
7. Click "Run and Debug".
8. You may have to select "VSCode Extension Development" from the Command Palette menu. 
9. A new window of VSCode should open. To test the plugin, you will use the new window. 

### Testing:

Please do whatever you want. The game is obviously unfinished, all you can do is grow plants. Nothing is preventing you from mashing keys, this is so that you can try things out quickly if you prefer.  
