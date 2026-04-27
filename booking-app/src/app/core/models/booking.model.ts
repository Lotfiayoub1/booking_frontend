export type BookingStatus = 'confirmed' | 'pending' | 'cancelled';

export interface Booking {
  id: number;
  sessionId: number;
  userId: number;
  sessionTitle: string;
  sessionDate: string;
  sessionStartTime: string;
  sessionEndTime: string;
  location: string;
  instructor: string;
  status: BookingStatus;
  bookedAt: string;
  price: number;
  notes?: string;
}

export interface BookingRequest {
  sessionId: number;
  notes?: string;
}
