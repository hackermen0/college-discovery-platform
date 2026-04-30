// frontend/types/college.ts
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

export interface College {
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
  createdAt: string;
  updatedAt: string;
}

export interface CollegePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ListCollegesResponse {
  data: College[];
  meta: CollegePagination;
}

export interface GetCollegeResponse {
  data: College;
}
