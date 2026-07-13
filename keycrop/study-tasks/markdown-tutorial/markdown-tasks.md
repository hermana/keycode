# Experiment Tasks

Each day of the study, you will make the same set of changes to a Markdown file.

To start the study, open the Markdown file corresponding to the day of the study. On the first day, you will open `study-task-day-one.md`. You will do the same set of actions each day of the study, as outlined below. 

Before beginning the tasks, open the Markdown preview so you can check your work as you go. You can open the preview in the current tab with `Ctrl+Shift+V` (Windows/Linux) or `Cmd+Shift+V` (Mac), or open it side by side with the editor using `Ctrl+K V` (Windows/Linux) or `Cmd+K V` (Mac). The side-by-side view is recommended.

---

## Task 1 — Fix repeated capitalization errors

The file uses the word **"markdown"** inconsistently — sometimes
capitalised, sometimes not. Your job is to standardise all occurrences of the
lowercase word `markdown` to `Markdown` throughout the file.

1. Open `study-task-day-<DAY>.md`.
2. Use **Find and Replace** to find every instance of `markdown` and replace it
   with `Markdown`. Find and Replace can be opened with `Ctrl+H` / `Cmd+Option+F`. Use the **Replace All** button to apply all changes at once.
3. Confirm the replacements look correct in the preview.

---

## Task 2 — Add a new section with multiple headings

You are going to add a short "Quick Reference" section at the very bottom of
the file. It should contain the following four lines, each as a heading at
the level shown:

```
## Quick Reference
### Quick Reference Part One: Text Formatting
### Quick Reference Part Two: Lists
### Quick Reference Part Three: Links and Images
```

1. Go to the bottom of `study-task-day-<DAY>.md`.
2. Type the first heading (`## Quick Reference`) manually.
3. Use **Copy Line Down** to duplicate it three times, giving you four identical
   lines. Copy Line Down is `Shift+Alt+Down` (Windows/Linux) or `Shift+Option+Down` (Mac). Once you have all four lines, place your cursor on the first duplicate and use Add Cursor Below (`Ctrl+Shift+Down` / `Cmd+Shift+Down`) three times to get a cursor on each line, then edit all four headings simultaneously.
4. Edit each duplicate in place to match the headings above.

---

## Task 3 — Comment out the diagrams without the author line

The tutorial contains three Mermaid diagram blocks (Class diagram, Sequence diagram, Flowchart) directly above the author credit line at the bottom of the file. In this task, you will comment out the diagrams. 

1. Use **Find** to locate the text `classDiagram` in `study-task-day-<DAY>.md`. Find is `Ctrl+F` / `Cmd+F`.
2. Select from the start of the "Class diagram" heading to the end of the Flowchart block using **Expand Selection** to grow your selection line by line. Expand Selection is `Shift+Alt+Right` (Windows/Linux) or `Shift+Ctrl+Right` (Mac).
3. If your selection overshoots into the "Author" line below, use
   **Reduce Selection** to shrink it back by one step at a time. Reduce Selection is `Shift+Alt+Left` (Windows/Linux) or `Shift+Ctrl+Left` (Mac).
4. Once the selection covers only the three diagram blocks, use
   **Toggle Block Comment** to wrap them in an HTML comment (`<!-- ... -->`), hiding them from the Markdown preview. Toggle Block Comment is `Ctrl+Shift+A` (Windows/Linux) or `Cmd+Shift+A` (Mac).
5. Check the preview to confirm the diagrams have disappeared but the author line at the bottom of the file is still visible.

---

## Task 4 — Add a note to the badge links using multiple cursors

Near the bottom of the file, under "Useful notes," there are three badge links in a row (Java, HTML, CSS). In this task, you will add the same short comment after all three at once.

1. Place your cursor at the end of the Java badge line.
2. Use **Add Cursor Below** twice to place a cursor at the end of the HTML and CSS badge lines as well, so you have three cursors total, one per line. Add Cursor Below is `Ctrl+Shift+Down` (Windows/Linux) or `Cmd+Shift+Down` (Mac).
3. Type `<!-- verified -->` once. It will be inserted at the end of all three lines simultaneously.
4. Confirm all three lines now end with the same comment.

---

## Done

Thank you for your participation! Please save the file and send it to the researchers (CONTACT INFO). 
