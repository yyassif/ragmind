import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCrawler } from "@/lib/components/KnowledgeToFeedInput/components/Crawler/hooks/useCrawler";

export const FromWebsites = (): JSX.Element => {
  const { handleSubmit, urlToCrawl, setUrlToCrawl } = useCrawler();

  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="website_url">Website URL *</Label>
      <Input
        type="text"
        id="website_url"
        placeholder="Enter a website's page URL"
        value={urlToCrawl}
        onChange={(e) => setUrlToCrawl(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            console.log("Submitted Enter");
            handleSubmit();
          }
        }}
      />
    </div>
  );
};
