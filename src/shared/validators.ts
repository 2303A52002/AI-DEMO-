import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const collegeQuerySchema = z.object({
  search: z.string().optional().default(''),
  state: z.string().optional().default(''),
  minFees: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  maxFees: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  rating: z.preprocess((val) => (val ? Number(val) : undefined), z.number().optional()),
  cursor: z.string().optional(),
  limit: z.preprocess((val) => (val ? Number(val) : 10), z.number().optional().default(10)),
  ids: z.string().optional(),
});

export type CollegeQueryInput = z.infer<typeof collegeQuerySchema>;

export const reviewSchema = z.object({
  rating: z.number().min(1, 'Rating must be at least 1 star').max(5, 'Rating cannot exceed 5 stars'),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100, 'Title cannot exceed 100 characters'),
  body: z.string().min(10, 'Review description must be at least 10 characters').max(1000, 'Review description cannot exceed 1000 characters'),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export const predictSchema = z.object({
  exam: z.enum(['JEE Main', 'JEE Advanced', 'NEET', 'CAT', 'GATE'], {
    message: 'Please select a valid exam',
  }),
  rank: z.number({ message: 'Rank must be a positive number' }).positive('Rank must be a positive number'),
  location: z.string(),
  branch: z.string(),
});

export type PredictInput = z.infer<typeof predictSchema>;

export const savedSchema = z.object({
  collegeId: z.string().min(1, 'College ID is required'),
});

export type SavedInput = z.infer<typeof savedSchema>;
