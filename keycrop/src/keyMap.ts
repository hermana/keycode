export const KEY_MAP: { key: string; category: string; capital_key: string; command: string; description: string }[] = [
  { key: 'ctrl+shift+p', category: 'Using VSCode', capital_key: "CTRL+SHIFT+P", command: 'command_palette', description: "Show command palette" },
  { key: 'ctrl+shift+k', category: 'Editing', capital_key: "CTRL+SHIFT+K", command: 'delete_current_line', description: "Delete current line" },
  { key: 'ctrl+shift+\\', category: 'Navigating Code', capital_key: "CTRL+SHIFT+\\", command: 'jump_to_bracket', description: "Jump to bracket" },
  { key: 'ctrl+t', category: 'Navigating Code', capital_key: "CTRL+T", command: 'show_all_symbols', description: "Show all symbols" },
  { key: 'ctrl+shift+o', category: 'Navigating Code', capital_key: "CTRL+SHIFT+O", command: 'go_to_symbol', description: "Go to symbol" },
  // { key: 'ctrl+shift+m', category: 'Debugging', capital_key: "CTRL+SHIFT+M", command: 'view_problems', description: "View problems" },
  { key: 'ctrl+shift+l', category: 'Multicursor', capital_key: "CTRL+SHIFT+L", command: 'cursor_at_all_occurrences', description: "Add a cursor at all occurrences" },
  { key: 'ctrl+shift+space', category: 'IntelliSense', capital_key: "CTRL+SHIFT+SPACE", command: 'trigger_parameter_hints', description: "Trigger parameter hints" },
  { key: 'ctrl+\\',          category: 'Using VSCode', capital_key: "CTRL+\\",          command: 'split_editor', description: "Split editor" },
  { key: 'ctrl+shift+tab',   category: 'Using VSCode', capital_key: "CTRL+SHIFT+TAB",   command: 'open_last_used_editor_in_group', description: "Open last used editor in group" },
  { key: 'ctrl+`',           category: 'Terminal', capital_key: "CTRL+`",           command: 'toggle_terminal', description: "Toggle terminal" },
  { key: 'ctrl+shift+`',     category: 'Terminal', capital_key: "CTRL+SHIFT+`",     command: 'create_new_terminal', description: "Create new terminal" },
  { key: 'ctrl+g',     category: 'Navigating Code', capital_key: "CTRL+G",     command: 'go_to_line', description: "Go to line" }, // this is where I started adding new stuff
  { key: 'ctrl+.',     category: 'Navigating Code', capital_key: "CTRL+.",     command: 'quick_fix', description: "Quick Fix" },
  { key: 'ctrl+shift+s',     category: 'Using VSCode', capital_key: "CTRL+SHIFT+S",     command: 'save_file_as', description: "Save File As" },
  { key: 'alt+up', category: 'Editing', capital_key: "ALT+UP", command: 'move_line_up', description: "Move line up" },   
  { key: 'alt+down', category: 'Editing', capital_key: "ALT+DOWN", command: 'move_line_down', description: "Move line down" },   
  { key: 'ctrl+l', category: 'Editing', capital_key: "CTRL+L", command: 'select_line', description: "Select line" },   
  { key: 'shift+alt+i', category: 'Multicursor', capital_key: "SHIFT+ALT+I", command: 'insert_cursor_at_end_of_each_line_selected', description: "Insert cursor at end of each line selected" },
  { key: 'ctrl+shift+up', category: 'Multicursor', capital_key: "CTRL+SHIFT+UP", command: 'add_cursor_above', description: "Add cursor above" },
  { key: 'ctrl+shift+down', category: 'Multicursor', capital_key: "CTRL+SHIFT+DOWN", command: 'add_cursor_below', description: "Add cursor below" },
]; 
    
  