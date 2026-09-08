export interface DeclineBookingModalProps {
  isOpen: boolean;
  clientName?: string;
  eventType?: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => Promise<void> | void;
}
