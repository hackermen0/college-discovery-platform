// backend/src/types/college.ts
export interface Placement {
  averageSalary: number;
  highestSalary: number;
  topRecruiters: string[];
  placementRate: number;
}

export interface Review {
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface CollegeWithPlacementsReviews {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placementRate: number;
  overview: string;
  placements: Placement;
  reviews: Review[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
