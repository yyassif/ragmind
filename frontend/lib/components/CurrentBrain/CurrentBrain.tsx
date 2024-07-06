import Image from "next/image";
import { Fragment } from "react";

import { Icon } from "@/lib/components/ui/Icon/Icon";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";

interface CurrentBrainProps {
  allowingRemoveBrain: boolean;
}

export const CurrentBrain = ({
  allowingRemoveBrain,
}: CurrentBrainProps): JSX.Element => {
  const { currentBrain, setCurrentBrainId } = useBrainContext();

  const removeCurrentBrain = (): void => {
    setCurrentBrainId(null);
  };

  if (!currentBrain) {
    return <Fragment />;
  }

  return (
    <div className="bg-gray-100 px-4 py-1 text-sm text-gray-600">
      <div className="flex justify-between items-center overflow-hidden">
        <div className="flex items-center gap-1 overflow-hidden whitespace-nowrap text-ellipsis">
          <span className="whitespace-nowrap">Talking to</span>
          <div className="flex gap-1 items-center overflow-hidden">
            {currentBrain.integration_logo_url ? (
              <Image
                src={
                  currentBrain.integration_logo_url
                    ? currentBrain.integration_logo_url
                    : "/assets/default_brain_image.png"
                }
                alt="brain"
                width={18}
                height={18}
              />
            ) : (
              <Icon size="small" name="brain" color="primary" />
            )}
            <span className="text-[#11243e] overflow-hidden whitespace-nowrap text-ellipsis font-medium">
              {currentBrain.name}
            </span>
          </div>
        </div>
        {allowingRemoveBrain && (
          <div
            onClick={(event) => {
              event.nativeEvent.stopImmediatePropagation();
              removeCurrentBrain();
            }}
          >
            <Icon size="normal" name="close" color="black" handleHover={true} />
          </div>
        )}
      </div>
    </div>
  );
};
