import Image from "next/image";
import { Fragment, useEffect, useState } from "react";

import { useBrainApi } from "@/lib/api/brain/useBrainApi";

type QuestionBrainProps = {
  brainName?: string | null;
  brainId?: string;
};
export const QuestionBrain = ({
  brainName,
  brainId,
}: QuestionBrainProps): JSX.Element => {
  const [brainLogoUrl, setBrainLogoUrl] = useState<string | undefined>(
    undefined
  );

  const { getBrain } = useBrainApi();

  const getBrainLogoUrl = async () => {
    if (brainId) {
      try {
        const brain = await getBrain(brainId.toString());
        setBrainLogoUrl(brain?.integration_description?.integration_logo_url);
      } catch (error) {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    void getBrainLogoUrl();
  }, [brainId]);

  if (brainName === undefined || brainName === null) {
    return <Fragment />;
  }

  return (
    <div
      data-testid="brain-tags"
      className="overflow-hidden flex items-center gap-2 text-black"
    >
      <Image
        src={brainLogoUrl ? brainLogoUrl : "/assets/default_brain_image.png"}
        alt="brainLogo"
        width={18}
        height={18}
      />
      <span className="overflow-hidden whitespace-nowrap text-ellipsis">
        {brainName}
      </span>
    </div>
  );
};
