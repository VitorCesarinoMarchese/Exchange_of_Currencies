import Btn from "./Btn";

function Infocard({
  title,
  text,
  label,
}: {
  title: string;
  text: string;
  label: string;
}) {
  return (
    <div className="bg-primary rounded-2xl text-center flex flex-col items-center max-w-[342px] p-6">
      <h2 className="font-bold text-secondary text-2xl">{title}</h2>
      <p className="max-w-[310px] mt-2 mb-6">{text}</p>
      <Btn color="secondary" label={label} />
    </div>
  );
}

export default Infocard;
