"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function DeleteAccountSection() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const canDelete = confirmation === "DELETE";

  async function handleDeleteAccount() {
    if (!canDelete) {
      toast.error("Type DELETE to confirm account deletion");
      return;
    }

    try {
      setIsDeleting(true);

      const response = await fetch("/api/account", {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        toast.error(data.message || "Failed to delete account");
        return;
      }

      toast.success("Account deleted");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <section className="mt-12 rounded-lg border-[4px] border-red-600 bg-red-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-24-black text-red-800">Danger Zone</h2>
          <p className="mt-1 text-sm text-red-700">
            Delete your profile, notes, uploads, and likes permanently.
          </p>
        </div>
        <Button
          type="button"
          className="bg-red-700 text-white hover:bg-red-800"
          onClick={() => setIsOpen(true)}
          disabled={isDeleting}
        >
          Delete Account
          <Trash2 className="ml-2 size-5" />
        </Button>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-account-title"
        >
          <div className="w-full max-w-md rounded-lg border-[4px] border-black bg-white p-5 shadow-[4px_4px_0_0_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 id="delete-account-title" className="text-24-black">
                  Delete Account
                </h3>
                <p className="mt-2 text-sm text-zinc-700">
                  Are you sure you want to delete your account? This action
                  cannot be undone.
                </p>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                aria-label="Close delete account confirmation"
              >
                <X className="size-5" />
              </Button>
            </div>

            <div className="mt-5">
              <label
                htmlFor="delete-account-confirmation"
                className="startup-form_label"
              >
                Type DELETE to confirm
              </label>
              <Input
                id="delete-account-confirmation"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                disabled={isDeleting}
                className="startup-form_input"
              />
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                type="button"
                className="bg-red-700 text-white hover:bg-red-800"
                onClick={handleDeleteAccount}
                disabled={isDeleting || !canDelete}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
                <Trash2 className="ml-2 size-5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
