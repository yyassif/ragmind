"use client";

import { Fragment, useEffect, useState } from "react";

import { AddBrainModal } from "@/components/modals/AddBrainModal";
import { UploadDocumentModal } from "@/components/modals/UploadDocumentModal/UploadDocumentModal";
import PageHeader from "@/components/partial/PageHeader";
import { MinimalBrainForUser } from "@/lib/context/BrainProvider/types";

import BrainsList from "./BrainsCards/components/BrainList";
import BrainSearchBar from "./BrainsCards/components/BrainSearchBar";
import { useBrainsCards } from "./BrainsCards/hooks/useBrainsCards";

export default function StudioPage(): JSX.Element {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredBrains, setFilteredBrains] = useState<MinimalBrainForUser[]>(
    []
  );
  const { isFetchingBrains, brains } = useBrainsCards();

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredBrains(brains);
    } else {
      setFilteredBrains(
        brains.filter((brain) =>
          brain.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery]);

  return (
    <Fragment>
      <PageHeader title="Brain Studio">
        <AddBrainModal />
        <UploadDocumentModal />
      </PageHeader>
      <BrainSearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <BrainsList brains={filteredBrains} isFetchingBrains={isFetchingBrains} />
    </Fragment>
  );
}
