import { Controller, FormProvider, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserApi } from "@/lib/api/user/useUserApi";
import { CompanySize, UsagePurpose } from "@/lib/api/user/user";
import { useOnboardingContext } from "@/lib/context/OnboardingProvider/hooks/useOnboardingContext";

import { OnboardingProps } from "./types/types";

export const OnboardingModal = (): JSX.Element => {
  const { isOnboardingModalOpened, setIsOnboardingModalOpened } =
    useOnboardingContext();

  const methods = useForm<OnboardingProps>({
    defaultValues: {
      username: "",
      companyName: "",
      companySize: undefined,
      usagePurpose: "",
    },
  });
  const { watch } = methods;
  const username = watch("username");

  const { updateUserIdentity } = useUserApi();

  const companySizeOptions = Object.entries(CompanySize).map(([, value]) => ({
    label: value,
    value: value,
  }));

  const usagePurposeOptions = Object.entries(UsagePurpose).map(
    ([key, value]) => ({
      label: value,
      value: key,
    })
  );

  const submitForm = async () => {
    await updateUserIdentity({
      username: methods.getValues("username"),
      company: methods.getValues("companyName"),
      onboarded: false,
      company_size: methods.getValues("companySize"),
      usage_purpose: methods.getValues("usagePurpose") as
        | UsagePurpose
        | undefined,
    });
    window.location.reload();
  };

  return (
    <FormProvider {...methods}>
      <Dialog
        open={isOnboardingModalOpened}
        onOpenChange={setIsOnboardingModalOpened}
      >
        <DialogContent
          className="sm:max-w-[768px]"
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <DialogClose />
          <DialogHeader>
            <DialogTitle>Welcome to RAGMind!</DialogTitle>
            <DialogDescription>
              Let us know a bit more about you to get started.
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 w-full">
            <div className="grid gap-1">
              <Label htmlFor="username">Username</Label>
              <Controller
                name="username"
                render={({ field }) => (
                  <Input
                    id="username"
                    placeholder="Choose a username"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="companyName">Company</Label>
              <Controller
                name="companyName"
                render={({ field }) => (
                  <Input
                    id="companyName"
                    placeholder="Your company name"
                    type="email"
                    value={field.value}
                    onChange={field.onChange}
                    className="w-full"
                  />
                )}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="goal">Usage Purpose</Label>
              <Controller
                name="usagePurpose"
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="In what context will you be using RAGMind." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Usage Purposes</SelectLabel>
                        {usagePurposeOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="grid gap-1">
              <Label htmlFor="goal">Size of your company</Label>
              <Controller
                name="companySize"
                render={({ field }) => (
                  <Select onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Number of employees in your company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Number of employees</SelectLabel>
                        {companySizeOptions.map((item) => (
                          <SelectItem key={item.value} value={item.value}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
          <DialogFooter className="flex w-full items-center">
            <Button
              type="button"
              onClick={() => void submitForm()}
              disabled={!username}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
};
