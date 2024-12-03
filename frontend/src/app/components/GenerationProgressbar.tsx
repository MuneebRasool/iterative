"use client";

import { Progress, Space } from "@mantine/core";
import { useEffect, useState } from "react";
import { loadingWords } from "../components/loadingWords";
import { TextLoop } from "easy-react-text-loop";

export const GenerationProgressbar = () => {
  const [progress, setProgress] = useState<number>(0);
  const loadingWord =
    loadingWords[Math.floor(Math.random() * loadingWords.length)];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 2;
        }
        if (prev === 100) {
          clearInterval(timer);
        }
        return prev;
      });
    }, 4000);
  }, []);

  return (
    <div className="flex flex-col gap-4 w-6/12 self-center grow h-full justify-center">
      <TextLoop>{loadingWord}</TextLoop>
      <Space h="md" />
      <Progress value={progress}></Progress>
    </div>
  );
};
