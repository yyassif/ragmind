import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";
import Balancer from "react-wrap-balancer";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import AnotherFeaturesSection from "./components/AnotherFeaturesSection/AnotherFeaturesSection";
import BusinessLine from "./components/BusinessLine/BusinessLine";
import CallToAction from "./components/CallToAction/CallToAction";
import FeaturesSection from "./components/FeaturesSection/FeautresSection";
import GetStartedButton from "./components/GetStartedButton/GetStartedButton";

export default function HomePage(): JSX.Element {
  return (
    <Fragment>
      <section className="space-y-6 pb-12 pt-16 lg:py-28">
        <div className="container flex max-w-[64rem] flex-col items-center gap-5 text-center">
          <Link
            href="https://twitter.com/yassineyassif"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "animate-fade-up opacity-0"
            )}
            style={{ animationDelay: "0.15s", animationFillMode: "forwards" }}
            target="_blank"
          >
            Introducing on <TwitterLogoIcon className="ml-2 h-4 w-4" />
          </Link>

          <h1
            className="animate-fade-up font-urban text-4xl font-extrabold tracking-tight opacity-0 sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
          >
            <Balancer>
              RAGMind Better, Your Knowledge You&apos;re{" "}
              <span className="relative bg-gradient-to-r from-indigo-500 to-purple-500/80 bg-clip-text font-extrabold text-transparent">
                Genius
              </span>
            </Balancer>
          </h1>

          <p
            className="max-w-[42rem] animate-fade-up leading-normal text-muted-foreground opacity-0 sm:text-xl sm:leading-8"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            <Balancer>
              Empower your entreprise with AI-driven data insights, making
              tracking and optimizing your business effortless.
            </Balancer>
          </p>

          <div
            className="flex animate-fade-up justify-center space-x-2 opacity-0 md:space-x-4"
            style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}
          >
            <GetStartedButton />
            <Link
              href="/login"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "px-4"
              )}
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              <p>
                <span className="hidden sm:inline-block">Lets explore</span>{" "}
                RAGMind
              </p>
            </Link>
          </div>
        </div>
      </section>
      <BusinessLine />
      <section>
        <FeaturesSection />
      </section>
      <section>
        <AnotherFeaturesSection />
      </section>
      <section>
        <CallToAction />
      </section>
    </Fragment>
  );
}
