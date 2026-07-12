# Experiment Tasks

Each day of the study, you will make the same set of changes to a Markdown file.

To start the study, open the Markdown file corresponding to the day of the study. On the first day, you will open` study-task-day-one.md`. You will do the same set of actions each day of the study, as outlined below.

Before beginning the tasks, open the Markdown preview so you can check your work as you go. You can open the preview in the current tab with Ctrl+Shift+V (Windows/Linux) or Cmd+Shift+V (Mac), or open it side by side with the editor using Ctrl+K V (Windows/Linux) or Cmd+K V (Mac). The side-by-side view is recommended.
---

## Task 1 — Fix repeated capitalization errors

The file uses the word **"markdown"** inconsistently — sometimes
capitalised, sometimes not. Your job is to standardise all occurrences of the
lowercase word `markdown` to `Markdown` throughout the file.

1. Open `study-task-day-<DAY>.md`.
2. Use **Find and Replace** to find every instance of `markdown` and replace it
   with `Markdown`.
3. Confirm the replacements look correct in the preview.
> **Tip:** Find and Replace can be opened with `Ctrl+H` / `Cmd+Option+F`.
> Use the **Replace All** button to apply all changes at once.

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
   lines.
4. Edit each duplicate in place to match the headings above.
> **Tip:** Copy Line Down is `Shift+Alt+Down` (Windows/Linux) or
> `Shift+Option+Down` (Mac). Once you have all four lines, place your cursor on
> the first duplicate and use Add Cursor Below (`Ctrl+Shift+Down` /
> `Cmd+Shift+Down`) three times to get a cursor on each line, then edit all
> four headings simultaneously.

---

## Task 3 — Build a reference table using multiple cursors

Under the `### Text Formatting` heading you just created, add the following
table:

```markdown
| Syntax | Example | Output |
|--------|---------|--------|
| `**text**` | `**bold**` | **bold** |
| `*text*` | `*italic*` | *italic* |
| `~~text~~` | `~~strike~~` | ~~strike~~ |
```

1. Type (or paste) just the three data rows without any `|` characters:
```
**text**   **bold**   bold
*text*     *italic*   italic
~~text~~   ~~strike~~ strikethrough
```
2. Use **Add Cursor Above/Below** to place a cursor at the start of all three
   lines simultaneously.
3. Type `| ` at the start of each line in one action.
4. Repeat at the end of each value to close the columns, then add the header
   row and separator row manually.
> **Tip:** Add Cursor Below is `Ctrl+Shift+Down` (Windows/Linux) or
> `Cmd+Shift+Down` (Mac).

---

## Task 4 — Comment out a section temporarily

The tutorial contains a section about editor tools (Stackedit, GitBook, etc.)
near the top of file. You want to hide this section from the rendered
output without deleting it.

1. Use **Find** to locate the text `Stackedit` in `study-task-day-<DAY>.md`.
2. Select from the start of that paragraph to the end of the editor tools list
   using **Expand Selection** to grow your selection line by line.
3. Use **Toggle Block Comment** to wrap the selected lines in an HTML comment
   (`<!-- ... -->`), which hides them from the Markdown preview.
4. Check the preview to confirm the section has disappeared from the rendered
   output.
5. Use **Toggle Block Comment** again on the same selection to restore it.
> **Tip:** Find is `Ctrl+F` / `Cmd+F`. Expand Selection is
> `Shift+Alt+Right` (Windows/Linux) or `Shift+Ctrl+Right` (Mac).
> Toggle Block Comment is `Ctrl+Shift+A` (Windows/Linux) or
> `Cmd+Shift+A` (Mac).

---

## Done

Thank you for your participation! Please save the file and send it to the researchers (CONTACT INFO). 
