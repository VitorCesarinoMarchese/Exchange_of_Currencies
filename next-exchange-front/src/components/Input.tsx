"use client"
function Input({
  type,
  placeholder,
  className,
  change,
  read = false,
  w = "w-80"
}: {
  type: string;
  placeholder: string;
  className?: string;
  change?: (e: any) => void;
  read?: boolean;
  w?: string
}) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className={`${w} border rounded-xl px-4 py-3 bg-white ${className}`}
        onChange={change}
        readOnly={read}
      />
    </>
  );
}

export default Input;
