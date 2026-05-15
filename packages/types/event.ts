export type EventStatus = 'Upcoming' | 'Completed';

export interface EventData {
  id: string;
  title: string;
  date: string;
  location: string;
  capacity: number;
  price: number | string;
  currencySymbol: string;
  description: string;
  image: string;
  status: EventStatus;
}
