"use client";
import { Button } from "@mantine/core";
import { useToolStore } from "../tool/toolstate";
import { ArrowBearRight } from "tabler-icons-react";

const buttonData = [
  { label: "Cats", prompt: "Build an app that generates random cat fact" },
  {
    label: "Travel",
    prompt:
      "Build a travel planner application that suggests itineraries, books hotels, and provides local attraction information.",
  },
  {
    label: "Fitness",
    prompt:
      "Build a fitness tracker app that logs workouts, tracks progress, and suggests exercise routines.",
  },
  { label: "QR Codes", prompt: "Build a QR code generator" },
];

export const PromptSuggestions = () => {
  const { setPrompt } = useToolStore();
  const buttons = buttonData.map((data) => {
    return (
      <Button
        key={data.label}
        variant="outline"
        radius="xl"
        size="xs"
        rightSection={<ArrowBearRight size={14} />}
        onClick={() => setPrompt(data.prompt)}
      >
        {data.label}
      </Button>
    );
  });

  return (
    <>
      <div className="flex gap-2">{buttons}</div>
    </>
  );
};
