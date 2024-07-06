import { useFromConnectionsContext } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/KnowledgeToFeed/components/FromConnections/FromConnectionsProvider/hooks/useFromConnectionContext";
import { ConnectionIcon } from "@/components/partial/ConnectionIcon/ConnectionIcon";
import { useSync } from "@/lib/api/sync/useSync";
import { Icon } from "@/lib/components/ui/Icon/Icon";

interface ConnectionLineProps {
  label: string;
  index: number;
  id: number;
}

export const ConnectionLine = ({
  label,
  index,
  id,
}: ConnectionLineProps): JSX.Element => {
  const { deleteUserSync } = useSync();
  const { setHasToReload } = useFromConnectionsContext();

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex gap-1 overflow-hidden">
        <ConnectionIcon letter={label[0]} index={index} />
        <span className="text-sm overflow-ellipsis">{label}</span>
      </div>
      <div className="flex gap-1">
        <Icon
          name="delete"
          size="normal"
          color="dangerous"
          handleHover={true}
          onClick={async () => {
            await deleteUserSync(id);
            setHasToReload(true);
          }}
        />
      </div>
    </div>
  );
};
