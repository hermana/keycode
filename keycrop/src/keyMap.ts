export const KEY_MAP: { key: string; capital_key: string; command: string; description: string }[] = [
  { key: 'ctrl+shift+p', capital_key: "CTRL+SHIFT+P", command: 'command_palette', description: "Show command palette" },
  { key: 'ctrl+shift+k', capital_key: "CTRL+SHIFT+K", command: 'delete_current_line', description: "Delete current line" },
  { key: 'ctrl+shift+\\', capital_key: "CTRL+SHIFT+\\", command: 'jump_to_bracket', description: "Jump to bracket" },
  { key: 'ctrl+t', capital_key: "CTRL+T", command: 'show_all_symbols', description: "Show all symbols" },
  { key: 'ctrl+shift+o', capital_key: "CTRL+SHIFT+O", command: 'go_to_symbol', description: "Go to symbol" },
  { key: 'ctrl+shift+m', capital_key: "CTRL+SHIFT+M", command: 'view_problems', description: "View problems" },
  { key: 'ctrl+shift+l', capital_key: "CTRL+SHIFT+L", command: 'cursor_at_all_occurrences', description: "Add a cursor at all occurrences" },
  { key: 'ctrl+shift+space', capital_key: "CTRL+SHIFT+SPACE", command: 'trigger_parameter_hints', description: "Trigger parameter hints" },
  { key: 'ctrl+\\',          capital_key: "CTRL+\\",          command: 'split_editor', description: "Split editor" },
  { key: 'ctrl+shift+tab',   capital_key: "CTRL+SHIFT+TAB",   command: 'open_last_used_editor_in_group', description: "Open last used editor in group" },
  { key: 'ctrl+`',           capital_key: "CTRL+`",           command: 'toggle_terminal', description: "Toggle terminal" },
  { key: 'ctrl+shift+`',     capital_key: "CTRL+SHIFT+`",     command: 'create_new_terminal', description: "Create new terminal" },
];
