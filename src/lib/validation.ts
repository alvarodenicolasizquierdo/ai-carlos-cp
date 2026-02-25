import { z } from 'zod';

/**
 * Reusable validation schemas for form inputs.
 */

export const contactFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .email('Please enter a valid email address'),
  topic: z
    .string()
    .trim()
    .min(1, 'Please select or enter a topic')
    .max(200, 'Topic must be less than 200 characters'),
  details: z
    .string()
    .trim()
    .max(5000, 'Details must be less than 5000 characters')
    .optional()
    .default(''),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const supplierFormSchema = z.object({
  companyName: z.string().trim().min(1, 'Company name is required').max(200),
  companyCode: z.string().trim().max(50),
  country: z.string().min(1, 'Country is required'),
  city: z.string().trim().max(100),
  factoryCount: z.string().regex(/^\d+$/, 'Must be a number'),
  contactName: z.string().trim().max(200),
  contactRole: z.string().trim().max(200),
  contactEmail: z.string().trim().email('Invalid email').max(255).or(z.literal('')),
  contactPhone: z.string().trim().max(30),
  notes: z.string().trim().max(2000),
});

export const inspectionFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(300),
  factoryName: z.string().trim().max(300),
  location: z.string().trim().max(300),
  assignee: z.string().trim().max(200),
  description: z.string().trim().max(5000),
  duration: z.string().regex(/^\d+$/).refine(v => Number(v) >= 1 && Number(v) <= 24, 'Duration must be 1-24 hours'),
});
