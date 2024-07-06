interface BrainRecapCardProps {
  label: string;
  number: number;
}

export const BrainRecapCard = ({
  label,
  number,
}: BrainRecapCardProps): JSX.Element => {
  return (
    <div className="flex justify-center shadow-sm items-center gap-2 p-4 rounded min-w-full max-w-full md:min-w-[120px] md:max-w-[200px] flex-1">
      <span className="text-primary text-xl">{number.toString()}</span>
      <span className=" text-lg">
        {label}
        {number > 1 ? "s" : ""}
      </span>
    </div>
  );
};
