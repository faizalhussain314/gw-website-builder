export const handleEnterKey = ({
  event,
  callback,
  value,
  setValue,
}: {
  event: React.KeyboardEvent;
  callback: () => void | Promise<void>;
  value?: string;
  setValue?: (newValue: string) => void;
}) => {
  // If Ctrl (or Cmd) + Enter is pressed:
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    // If this is a controlled textarea (value and setValue provided),
    // insert a newline at the cursor position.
    if (value !== undefined && setValue) {
      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + "\n" + value.substring(end);
      setValue(newValue);
      // Optionally reposition the cursor and scroll down:
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
        target.scrollTop = target.scrollHeight;
      }, 0);
    }
    // Do nothing else – default behavior is now handled via state update.
    return;
  }

  // If only Enter is pressed (without Ctrl/Cmd):
  if (event.key === "Enter" && !(event.ctrlKey || event.metaKey)) {
    event.preventDefault(); // Prevent a new line from being created
    callback(); // Trigger the custom action
  }
};
