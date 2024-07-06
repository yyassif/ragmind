import { SyncElementLine } from "../SyncElementLine/SyncElementLine";

interface FolderLineProps {
  name: string;
  selectable: boolean;
  id: string;
}

export const FolderLine = ({
  name,
  selectable,
  id,
}: FolderLineProps): JSX.Element => {
  return (
    <SyncElementLine
      id={id}
      name={name}
      selectable={selectable}
      isFolder={true}
    />
  );
};
