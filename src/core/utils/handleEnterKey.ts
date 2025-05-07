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
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    if (value !== undefined && setValue) {
      const target = event.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newValue = value.substring(0, start) + "\n" + value.substring(end);
      setValue(newValue);

      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 1;
        target.scrollTop = target.scrollHeight;
      }, 0);
    }

    return;
  }

  if (event.key === "Enter" && !(event.ctrlKey || event.metaKey)) {
    event.preventDefault();
    callback();
  }
};
