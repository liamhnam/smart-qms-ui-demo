export type TicketStatus = 'WAITING' | 'SERVING' | 'COMPLETED' | 'SKIPPED' | 'CANCELLED';

export type CounterStatus = 'ACTIVE' | 'BREAK' | 'CLOSED';

export interface Category {
  id: string;
  code: string;
  name: string;
  description: string;
  iconName: string;
  prefix: string; // e.g. "A", "B", "C"
  currentNumber: number;
  averageWaitMinutes: number;
  waitingCount: number;
  color: string;
}

export interface Staff {
  id: string;
  fullName: string;
  title: string;
  employeeCode: string;
  avatarUrl: string;
  department: string;
  ratingAverage: number;
  ratingCount: number;
}

export interface Counter {
  id: string;
  code: string; // e.g. "01", "02", "03"
  title: string; // e.g. "Quầy số 01 - Đất đai & Nhà ở"
  assignedStaff: Staff;
  status: CounterStatus;
  categoryIds: string[];
  currentTicketId?: string;
  todayServedCount: number;
  avgServeMinutes: number;
}

export interface CitizenInfo {
  name: string;
  citizenId?: string; // CCCD 12 số
  birthYear?: string;
  phone?: string;
  address?: string;
  isPriority?: boolean; // Ưu tiên người già, phụ nữ mang thai
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g. "A-102"
  categoryId: string;
  categoryName: string;
  counterId?: string;
  counterTitle?: string;
  citizen: CitizenInfo;
  status: TicketStatus;
  issuedAt: string; // ISO string
  calledAt?: string;
  completedAt?: string;
  estimatedWaitMinutes: number;
  waitDurationSeconds?: number;
  serviceDurationSeconds?: number;
  rating?: {
    score: number; // 1 to 5
    tags: string[];
    feedback?: string;
    submittedAt: string;
  };
}

export interface SystemKPIs {
  totalIssuedToday: number;
  currentlyWaiting: number;
  currentlyServing: number;
  completedToday: number;
  skippedToday: number;
  averageWaitMinutes: number;
  averageServeMinutes: number;
  satisfactionRate: number; // percentage
}
