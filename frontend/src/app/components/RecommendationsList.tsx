"use client";

import {
  Accordion,
  AccordionControl,
  AccordionItem,
  AccordionPanel,
  Button,
  Drawer,
} from "@mantine/core";
import { useToolStore } from "../tool/toolstate";

interface ChatProps {
  recommendations: Recommendation[];
  toggle: () => void;
  opened: boolean;
}

export const RecommendationsList = ({
  recommendations,
  toggle,
  opened,
}: ChatProps) => {
  const { setPrompt, resetUnreadIterationState } = useToolStore();

  const handleCloseClick = () => {
    resetUnreadIterationState();
    toggle();
  };

  const handleCopyPromptClick = (prompt: string) => {
    setPrompt(prompt);
    toggle();
  };

  const items = recommendations.map((item) => (
    <AccordionItem key={item.id} value={item.description}>
      <AccordionControl>{item.name}</AccordionControl>
      <AccordionPanel>
        <div className="flex flex-col gap-2">
          {item.description}
          <Button
            variant="light"
            onClick={() => handleCopyPromptClick(item.description)}
          >
            Copy Prompt
          </Button>
        </div>
      </AccordionPanel>
    </AccordionItem>
  ));
  return (
    <>
      <Drawer
        opened={opened}
        onClose={handleCloseClick}
        title={"Potential Iterations"}
      >
        <Drawer.Body>
          <Accordion variant="separated">{items}</Accordion>
        </Drawer.Body>
      </Drawer>
    </>
  );
};
