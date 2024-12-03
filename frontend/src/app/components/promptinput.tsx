"use client";
import { ChangeEvent, useState } from "react";
import { Button, Text, Textarea } from "@mantine/core";
import { useToolStore } from "../tool/toolstate";

interface PromptInputProps {
  user: any;
  onPromptSubmit: (prompt: string) => void;
  onProjectReset: () => void;
  loading: boolean;
}

const PromptInput = ({
  user,
  onProjectReset,
  onPromptSubmit,
  loading,
}: PromptInputProps) => {
  const { prompt, setPrompt } = useToolStore();
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  const onChange = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => {
    setPrompt(event.currentTarget.value);
  };

  const onPromptInputSubmit = () => {
    onPromptSubmit(prompt);
  };

  const onSuccessfulLogin = () => {
    setShowLoginModal(false);
    window.location.reload();
  };

  return (
    <div className="flex flex-col w-full items-center justify-center gap-2 max-w-[500px]">
      <Textarea
        className="w-full"
        id="prompt"
        placeholder="Build me a coffee order management system"
        radius="xl"
        autosize
        onChange={onChange}
        value={prompt}
        disabled={loading}
        readOnly={loading}
      />
      <Button
        onClick={onPromptInputSubmit}
        loading={loading}
        fullWidth
        variant="filled"
      >
        Build!
      </Button>
      <Text className="self-start" c="dimmed" size="xs">
        *The system currently generates web applications only.
      </Text>
    </div>
  );
};

export default PromptInput;
