export interface Session {
  id: number;
  title: string;
  description: string;
  instructor: string;
  category: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  capacity: number;
  availableSlots: number;
  price: number;
  imageUrl?: string;
  tags?: string[];
}

export interface SessionFilter {
  category?: string;
  date?: string;
  search?: string;
}
