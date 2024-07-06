import React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Knowledge } from "@/lib/types/Knowledge";

import KnowledgeItem from "./KnowledgeItem/KnowledgeItem";

interface KnowledgeTableProps {
  knowledgeList: Knowledge[];
}

const KnowledgeTable = React.forwardRef<HTMLDivElement, KnowledgeTableProps>(
  ({ knowledgeList }, ref) => {
    return (
      <Card className="w-full" ref={ref}>
        <CardHeader>
          <CardTitle>Uploaded Knowledge</CardTitle>
          <CardDescription>List of all the uploaded files.</CardDescription>
        </CardHeader>
        <CardContent>
          {knowledgeList.map((knowledge) => (
            <KnowledgeItem knowledge={knowledge} key={knowledge.id} />
          ))}
        </CardContent>
      </Card>
    );
  }
);

KnowledgeTable.displayName = "KnowledgeTable";

export default KnowledgeTable;
