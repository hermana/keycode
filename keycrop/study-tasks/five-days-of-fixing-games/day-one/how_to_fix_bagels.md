# How to fix the Bagels game

To fix the game, you will need to make the following edits to the file. 

1. The constant variable `NUM_DIGITS` is not spelled consistently throughout the file. Sometimes, it appears as `NUM_DIDGITS`. You can use `CTRL+H` or `CMD+H` to replace all occurences where the spelling is not consistent.

2. Lines 37 to 51 should be indented such that they are within the `while` loop. You can highlight lines 37 to 51 use `CTRL+]` or `CMD+]` to indent them so that they are within the loop. 

3. After Step 2, Click within the brackets of the the `getClues()` function call on line 43 use `CTRL+SHIFT+SPACE` or `CMD+SHIFT+SPACE` to check which parameter is missing from the function call. Once you have added it, the program should run without errors.


# Running the game

1. Open your terminal (`` CTRL+` `` or `` CMD+` ``) and `cd` into the same directory as `bagels.py`. 
2. Run `python bagels.py`. 
3. You have completed the task!