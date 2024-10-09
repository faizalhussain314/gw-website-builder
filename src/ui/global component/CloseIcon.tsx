function CloseIcon() {
  const handleClose = () => {};
  return (
    <div
      onClick={handleClose}
      className="p-2 cursor-pointer text-black hover:text-palatinate-blue-600 bg-gray-100 rounded-md"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
      >
        <path
          d="M1 11L11 1M1 1L11 11"
          stroke="currentColor"
          stroke-width="1.6"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
  );
}

export default CloseIcon;
