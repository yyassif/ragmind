"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import ApiKeyConfig from "./ApiKeyConfig/ApiKeyConfig";
import EmailInformation from "./EmailInformation";
import LanguageSelect from "./LanguageSelect/LanguageSelect";

export default function SettingsTab({ email }: { email: string }): JSX.Element {
  return (
    <div className="flex flex-col gap-4 w-full p-4">
      <Card className="shadow-none hover:shadow-none w-full md:self-start">
        <CardHeader className="border-b-0">
          <CardTitle className="font-semibold">Profile settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-4">
          <EmailInformation email={email} />
          <LanguageSelect />
          <ApiKeyConfig />
        </CardContent>
      </Card>
    </div>
  );
}
