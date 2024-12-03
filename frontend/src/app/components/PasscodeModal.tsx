import { Button, Label, Modal, TextInput } from "flowbite-react";
import React, { useState, useEffect } from "react";

interface PasscodeModalProps {
  isOpen: boolean;
  onPasswordSubmit: (passcode: string) => void;
  invalidPasscode: boolean;
}
export const PasscodeModal = ({
  isOpen,
  onPasswordSubmit,
  invalidPasscode,
}: PasscodeModalProps) => {
  const [passcode, setPasscode] = useState("");

  return (
    <>
      <Modal show={isOpen} size="md" popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
              Enter Passcode to View
            </h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="project" value="Passcode" />
              </div>
              <TextInput
                id="passcode"
                placeholder="Passcode"
                value={passcode}
                onChange={(event) => {
                  setPasscode(event.target.value);
                }}
                required
              />
              {invalidPasscode ? (
                <div className="mt-2">Passcode is incorrect</div>
              ) : null}
            </div>
            <div className="flex justify-between"></div>
            <div className="w-full">
              <Button onClick={() => onPasswordSubmit(passcode)}>
                Enter Passcode
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};
