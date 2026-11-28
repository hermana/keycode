# How to fix the Twenty Forty Eight game

If you have not installed the experiment plugin or reviewed the README.md file which describes the plugin, please do so before fixing the Twenty Forty Eight game. 

To fix the game, you will need to make the following edits to the file. Please use hotkeys to edit the file as indicated in the instructions below.

1. The variable `board` is sometimes misspelled as `bloard` in the file. You can use `CTRL+H` (Windows/Linux) or `CMD+H` (Mac) to correct the spelling so that it is consistent.

2. Lines 180 to 200 should be indented such that they are within the `for` loop. You can highlight lines 180 to 200 and use `CTRL+]` (Windows/Linux) or `CMD+]` (Mac) twice to indent them so that they are within the loop. 

3. Click within the brackets of the call to the `combineTilesInColumn()` function on line 194 use `CTRL+SHIFT+SPACE` (Windows/Linux) or `CMD+SHIFT+SPACE` (Mac) to check which parameter is missing from the function call. Once you have added it, the program should run without errors.


# Running the game

1. Open your terminal (`` CTRL+` `` (Windows/Linux) or `` CMD+` `` (Mac)) and `cd` into the same directory as `twenty_forty_eight.py`. 
2. Run `python twenty_forty_eight.py`. 
3. OPTIONAL: If you'd like, you may try out the game. You may need to make your terminal window larger or scroll up in order to read the game's instructions. 
4. You have completed the task!
