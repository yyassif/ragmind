interface ConnectionIconProps {
  letter: string;
  index: number;
}

export const ConnectionIcon = ({
  letter,
  index,
}: ConnectionIconProps): JSX.Element => {
  const colors = ["#FBBC04", "#F28B82", "#8AB4F8", "#81C995", "#C58AF9"];

  return (
    <div
      className="text-white min-w-6 min-h-6 max-h-6 max-w-6 text-sm flex items-center justify-center border-background p-0.5 rounded-full border-2 border-solid"
      style={{ backgroundColor: colors[index % 5] }}
    >
      {letter.toUpperCase()}
    </div>
  );
};
