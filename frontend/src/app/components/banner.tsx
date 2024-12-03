import React, { useState } from "react";
import Link from "next/link";
import Modal from "./modal";
import { TypeAnimation } from "react-type-animation";
import { Button } from "@mantine/core";

export default function banner() {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  return (
    <div className=" h-auto bg-black">
      <div className="">
        <div className="inset-0 flex h-auto  flex-col items-center justify-center bg-zinc-950 bg-opacity-80">
          <div className="flex flex-col  gap-10 py-10 sm:py-24 ">
            <div className="text-center">
              <h2 className="text-5xl font-bold text-white">Iterative</h2>
              <p className="my-5 text-lg text-white">
                From Idea to Prototype – Code-Free, Hassle-Free, Instantly.
              </p>
              <p className="my-5 text-md text-white">
                Empowering designers and product teams to transform concepts
                into interactive prototypes effortlessly.
              </p>

              <Button component={Link} variant="filled" href="/tool">
                Start Prototyping Now!
              </Button>
            </div>

            <div className="mt-5 flex flex-col justify-center">
              <div className="flex h-96 w-auto justify-center rounded bg-gray-900 ">
                {showBanner ? (
                  <div className=" mx-10 flex  animate-masking  flex-col items-center justify-center overflow-hidden  rounded delay-[500ms] ">
                    <Modal />
                  </div>
                ) : null}
              </div>
              <div className="rounded-lg border border-white pr-3 p-2">
                <TypeAnimation
                  className="p-2 my-3 ml-3 text-md text-white "
                  sequence={[
                    1000,
                    "Build me something that users can accept for a rewards program.",
                    () => {
                      setShowBanner(true);
                    },
                    5000,
                    "",
                    () => {
                      setShowBanner(false);
                    },
                  ]}
                  speed={60}
                  omitDeletionAnimation={true}
                  repeat={Infinity}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
