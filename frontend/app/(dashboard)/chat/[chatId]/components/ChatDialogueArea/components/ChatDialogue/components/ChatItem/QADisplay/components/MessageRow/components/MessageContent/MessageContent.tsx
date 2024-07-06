import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

import { cn } from "@/lib/utils";

import styles from "./MessageContent.module.scss";

export const MessageContent = ({
  text,
  hide,
  isUser,
}: {
  text: string;
  isUser: boolean;
  hide?: boolean;
}): JSX.Element => {
  const [showLog] = useState(true);
  const [isLog, setIsLog] = useState(true);

  const extractLog = (log: string) => {
    const logRegex = /🧠<([^>]+)>🧠/g;
    const logs = [];
    let match;

    while ((match = logRegex.exec(log))) {
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      logs.push("- " + match[1] + "  \n");
    }

    return {
      logs: logs.join(""), // Join with empty string, each log already has newline
      cleanedText: log.replace(logRegex, ""),
    };
  };

  useEffect(() => {
    if (text.includes("🧠<")) {
      setIsLog(true);
    } else {
      setIsLog(false);
    }
  }, [text]);

  const { logs, cleanedText } = extractLog(text);

  return (
    <div
      className={cn(hide && !isUser && "hidden")}
      data-testid="chat-message-text"
    >
      {isLog && showLog && logs.length > 0 && (
        <div className="text-xs text-white p-2 rounded">
          <ReactMarkdown>{logs}</ReactMarkdown>
        </div>
      )}
      {cleanedText === "🧠" ? (
        // <Loader className="animate-spin" />
        "▌"
      ) : (
        <ReactMarkdown className={styles.markdown}>{cleanedText}</ReactMarkdown>
      )}
    </div>
  );
};
