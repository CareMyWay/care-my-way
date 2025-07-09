import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function CompleteProfileModal({ show }: { show: boolean }) {
  const [isOpen, setIsOpen] = useState(show);
  const router = useRouter();

  useEffect(() => {
    setIsOpen(show);
  }, [show]);

  const handleStart = () => {
    setIsOpen(false);
    router.push("/client-dashboard/profile-setup");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => {}}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          leave="ease-in duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            leave="ease-in duration-200"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
              <Dialog.Title className="text-lg font-bold">
                Complete Your Profile
              </Dialog.Title>
              <Dialog.Description className="text-sm text-gray-600 mt-2">
                Fill in your personal information before using the dashboard.
              </Dialog.Description>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleStart}
                  className="bg-[#4A9B9B] text-white px-4 py-2 rounded hover:bg-[#3A8B8B]"
                >
                  Start
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
