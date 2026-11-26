# How to fix the Hangman game

To fix the game, you will need to make the following edits to the file. 

1. The keyword `elif` is not misspelled as `elfif` throughout the file. You can use `CTRL+H` or `CMD+H` to correct the spelling.

2. Lines 92 to 106 should be indented such that they are within the `if` clause. You can highlight lines 92 to 106 use `CTRL+]` or `CMD+]` to indent them so that they are within the clause. 

3. After Step 2, Click within the brackets of the the `drawHangman()` function call on line 116 use `CTRL+SHIFT+SPACE` or `CMD+SHIFT+SPACE` to check which parameter is missing from the function call. Once you have added it, the program should run without errors. 


# Running the game

1. Open your terminal (`` CTRL+` `` or `` CMD+` ``) and `cd` into the same directory as `hangman.py`. 
2. Run `python hangman.py`. 
3. You have completed the task!