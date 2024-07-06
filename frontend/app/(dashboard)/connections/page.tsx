"use client";

import { Fragment } from "react";

import { AddBrainModal } from "@/components/modals/AddBrainModal";
import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal/UploadDocumentModal";
import { ConnectionCards } from "@/components/partial/ConnectionCards/ConnectionCards";
import PageHeader from "@/components/partial/PageHeader";

export default function ConnectionsPage(): JSX.Element {
  return (
    <Fragment>
      <PageHeader title="Connections">
        <AddBrainModal />
        <UploadDocumentModal />
      </PageHeader>
      <div className="flex gap-4 flex-col w-full p-4">
        <h2 className="text-lg">Link apps you want to search across</h2>
        <ConnectionCards />
      </div>
    </Fragment>
  );
}
