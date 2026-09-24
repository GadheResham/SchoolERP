import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDanger = false,
  loading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <div
            className={`p-2.5 rounded-full shrink-0 ${
              isDanger ? 'bg-[#ffdad6] text-[#dc2626]' : 'bg-[#eaedff] text-[#2563eb]'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {isDanger ? 'warning' : 'help'}
            </span>
          </div>
          <p className="text-sm text-[#434655] leading-relaxed pt-1">{message}</p>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#f1f5f9]">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={isDanger ? 'danger' : 'primary'}
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
