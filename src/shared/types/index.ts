export interface User {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
}

export interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: number;
  seats: number;
  fees: number;
}

export interface Placement {
  id: string;
  collegeId: string;
  avgSalary: number;
  highestSalary: number;
  placementPercent: number;
  topRecruiters: string[];
}

export interface Review {
  id: string;
  collegeId: string;
  userId: string;
  rating: number;
  title: string;
  body: string;
  createdAt: Date;
  user?: {
    name: string | null;
    image: string | null;
  };
}

export interface College {
  id: string;
  name: string;
  slug: string;
  location: string;
  state: string;
  fees: number;
  rating: number;
  description: string;
  established: number;
  accreditation: string;
  campusSize: number;
  website: string;
  imageUrl: string;
  createdAt: Date;
}

export interface CollegeWithRelations extends College {
  courses?: Course[];
  placement?: Placement | null;
  reviews?: Review[];
  _count?: {
    reviews: number;
    savedByUsers: number;
  };
}

export interface CollegesResponse {
  data: CollegeWithRelations[];
  nextCursor: string | null;
  total: number;
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  savedAt: Date;
  college?: CollegeWithRelations;
}
