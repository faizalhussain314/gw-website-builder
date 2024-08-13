interface SpinnerProps {
  size?: string;
  className?: string;
}
export default function Spinner(props: SpinnerProps) {
  const { size, className } = props;
  return (
    <>
      <div
        className={`${
          size === "sm" ? "h-6 w-6" : "h-8 w-8"
        }  motion-reduce:animate-[spin_1.2s_linear_infinite]} inline-block animate-spin rounded-full border-[2.5px] border-solid border-blue-600 border-r-gray-300 align-[-0.125em] ${className}`}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </>
  );
}
