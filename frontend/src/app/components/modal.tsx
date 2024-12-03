"use client";
import { CheckIcon } from "@heroicons/react/24/outline";

export default function Modal() {
  return (
    <div className="flex items-center justify-center text-white">
      <div className=" rounded-lg bg-black px-4 pb-4 pt-5 text-left">
        <div>
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <CheckIcon className="h-6 w-6 text-blue-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h2 className="text-lg font-medium leading-6 text-white ">
              SandyTown Coffee Shop
            </h2>
            <div className="mt-2">
              <p className="text-sm text-gray-500 ">
                You have received rewards from signing up!
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-6">
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-950 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:text-sm"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
