import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function EmailInformation({
  email,
}: {
  email: string;
}): JSX.Element {
  return (
    <div className="flex flex-col space-y-2">
      <Label htmlFor="email">Email *</Label>
      <Input
        type="email"
        id="email"
        disabled
        defaultValue={email}
        placeholder="Email"
      />
    </div>
  );
}
