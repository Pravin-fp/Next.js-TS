import { ReactNode } from "react";

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-xl font-bold"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}
