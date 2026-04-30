export interface CompareCollege {
  id: string;
  name: string;
  location: string;
  fees: number;
  rating: number;
  courses: string[];
  placementRate: number;
  placements: {
    averageSalary: number;
    topRecruiters: string[];
    rate: number;
  };
}

export interface CompareResponse {
  colleges: CompareCollege[];
}

export interface SavedComparisonSummary {
  id: string;
  userId: string;
  collegeIds: string[];
  label?: string | null;
  createdAt: string;
  collegeNames: string[];
}

export interface SavedComparisonsResponse {
  comparisons: SavedComparisonSummary[];
}

export interface SaveComparisonResponse {
  comparison: {
    id: string;
    userId: string;
    collegeIds: string[];
    label?: string | null;
    createdAt: string;
  };
}