import { CornerDownLeft, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { Editor } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/ChatInput/components/ChatEditor/Editor/Editor";
import { useChatInput } from "@/app/(dashboard)/chat/[chatId]/components/ActionsBar/components/ChatInput/hooks/useChatInput";
import { useChat } from "@/app/(dashboard)/chat/[chatId]/hooks/useChat";
import { Button } from "@/components/ui/button";
import { CurrentBrain } from "@/lib/components/CurrentBrain/CurrentBrain";
import { useChatContext } from "@/lib/context";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { cn } from "@/lib/utils";

export const SearchBar = ({
  onSearch,
}: {
  onSearch?: () => void;
}): JSX.Element => {
  const [searching, setSearching] = useState<boolean>(false);
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const { message, setMessage } = useChatInput();
  const { setMessages } = useChatContext();
  const { addQuestion } = useChat();
  const { currentBrain, setCurrentBrainId } = useBrainContext();

  useEffect(() => {
    setCurrentBrainId(null);
  }, []);

  useEffect(() => {
    setIsDisabled(message.trim() === "");
  }, [message]);

  const submit = async (): Promise<void> => {
    if (!searching) {
      setSearching(true);
      setMessages([]);
      try {
        if (onSearch) {
          onSearch();
        }
        await addQuestion(message);
      } catch (error) {
        console.error(error);
      } finally {
        setSearching(false);
      }
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-2 bg-background text-foreground overflow-hidden rounded-xl border border-solid border-border",
        currentBrain && "pt-0"
      )}
    >
      <CurrentBrain allowingRemoveBrain={true} />
      <div
        className={cn(
          "flex items-center justify-between p-4",
          currentBrain && "pt-0"
        )}
      >
        <Editor
          message={message}
          setMessage={setMessage}
          onSubmit={() => void submit()}
          placeholder="Ask a question..."
        />
        <Button
          type="submit"
          size="icon"
          disabled={isDisabled || searching}
          onClick={() => void submit()}
        >
          {searching ? (
            <Loader2 className="animate-spin" />
          ) : (
            <CornerDownLeft />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </div>
    </div>
  );
};
