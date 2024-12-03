import { Spinner } from "flowbite-react";

export default function Loading() {
  return (
    <div className="bg-[rgba(0, 0, 0, 0.81)] absolute top-0 flex h-[calc(100vh)] w-full items-center justify-center rounded-lg border border-gray-200 backdrop-blur-[3px] dark:border-gray-700 dark:bg-gray-800">
      <Spinner aria-label="Loading content" size="lg" />
    </div>
  );
}
