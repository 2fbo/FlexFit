export type Priority = 'Low' | 'Medium' | 'High';
export type TicketStatus = 'Open' | 'Resolved';

export interface Ticket {
  id: number;
  equipment: string;
  location: string;
  issue: string;
  priority: Priority;
  status: TicketStatus;
  dateReported: string;
}

export interface User {
  username: string;
  role: string;
}

export type Page = 'home' | 'login' | 'dashboard' | 'add-ticket';
