import { CornerDownLeft, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CurrentBrain } from "@/lib/components/CurrentBrain/CurrentBrain";
import { useBrainContext } from "@/lib/context/BrainProvider/hooks/useBrainContext";
import { cn } from "@/lib/utils";

import { ChatEditor } from "./components/ChatEditor/ChatEditor";
import { useChatInput } from "./hooks/useChatInput";

export const ChatInput = (): JSX.Element => {
  const { setMessage, submitQuestion, generatingAnswer, message } =
    useChatInput();
  const { currentBrain } = useBrainContext();

  const handleSubmitQuestion = () => {
    if (message.trim() !== "") {
      submitQuestion();
    }
  };

  return (
    <form
      data-testid="chat-input-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmitQuestion();
      }}
    >
      <div className="flex flex-col bg-background text-foreground gap-2 rounded-xl overflow-hidden border-border border">
        <CurrentBrain allowingRemoveBrain={false} />
        <div className={cn("flex p-4 items-center", currentBrain && "pt-0")}>
          <ChatEditor
            message={message}
            setMessage={setMessage}
            onSubmit={handleSubmitQuestion}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!message || generatingAnswer}
            onClick={handleSubmitQuestion}
          >
            {generatingAnswer ? (
              <Loader2 className="animate-spin" />
            ) : (
              <CornerDownLeft />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
};
