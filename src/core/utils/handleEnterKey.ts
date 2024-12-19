type HandleKeyDownParams = {
  event: React.KeyboardEvent<HTMLFormElement>;
  callback: (event: React.KeyboardEvent<HTMLFormElement>) => void;
};

export const handleEnterKey = ({
  event,
  callback,
}: HandleKeyDownParams): void => {
  if (event.key === "Enter") {
    event.preventDefault();
    callback(event);
  }
};
