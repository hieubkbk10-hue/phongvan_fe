import { create } from 'zustand';

interface ModalState {
  activeModalId: string | null;
  modalData: unknown;
  openModal: (modalId: string, data?: unknown) => void;
  closeModal: () => void;
  isOpen: (modalId: string) => boolean;
}

export const useModalStore = create<ModalState>((set, get) => ({
  activeModalId: null,
  modalData: null,

  openModal: (modalId: string, data: unknown = null) =>
    set({
      activeModalId: modalId,
      modalData: data,
    }),

  closeModal: () =>
    set({
      activeModalId: null,
      modalData: null,
    }),

  isOpen: (modalId: string) => get().activeModalId === modalId,
}));
