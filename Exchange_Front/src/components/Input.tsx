function Input({
  type,
  placeholder,
  className,
  change,
  read = false,
}: {
  type: string;
  placeholder: string;
  className?: string;
  change?: () => void;
  read?: boolean;
}) {
  return (
    <>
      <input
        type={type}
        placeholder={placeholder}
        className={"w-80 border rounded-2xl px-4 py-3  bg-white"+ " " + className}
        onChange={change}
        readOnly={read}
      />
    </>
  );
}

export default Input;
