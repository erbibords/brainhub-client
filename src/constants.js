import { getBranch } from './utils/token';

export const DEFAULT_BRANCH_ID = () => {
  return getBranch();
};
export const BASE_URL = 'https://brainhub-sandbox-api.onrender.com/v1/';

export const COURSE_BASE_URL = `branches/${DEFAULT_BRANCH_ID()}/courses`;
export const STUDENT_BASE_URL = `branches/${DEFAULT_BRANCH_ID()}/students`;
export const OFFERING_BASE_URL = `branches/${DEFAULT_BRANCH_ID()}/offerings`;
export const REVIEW_PROGRAM_BASE_URL = `branches/${DEFAULT_BRANCH_ID()}/review-programs`;
export const PAYMENTS_BASE_URL = `branches/${DEFAULT_BRANCH_ID()}/payments`;
export const SCHOOLS_BASE_URL = `branches/${DEFAULT_BRANCH_ID()}/schools`;
export const ENROLLMENT_BASE_URL = `branches/${DEFAULT_BRANCH_ID()}/enrollments`;
export const MEDIA_BASE_URL = `${BASE_URL}branches/${DEFAULT_BRANCH_ID()}/payments/uploads`;

export const YEAR = [
  '2024',
  '2024-2025',
  '2025',
  '2025-2026',
  '2026',
  '2026-2027',
  '2027',
  '2027-2028',
  '2028',
  '2028-2029',
  '2029',
  '2029-2030',
  '2030',
  '2030-2031',
];
export const YEAR_LEVELS = [
  '1st Year',
  '2nd Year',
  '3rd Year',
  '4th Year',
  '5th Year',
  '6th Year',
  'Graduated'
];

export const SEMESTER = [
  {
    label: '1st',
    value: 'FIRST_SEMESTER',
  },
  {
    label: '2nd',
    value: 'SECOND_SEMESTER',
  },
  {
    label: 'Summer',
    value: 'SUMMER',
  },
  {
    label: 'Whole Year',
    value: 'WHOLE_YEAR',
  },
  {
    label: 'January',
    value: 'JANUARY',
  },
  {
    label: 'February',
    value: 'FEBRUARY',
  },
  {
    label: 'March',
    value: 'MARCH',
  },
  {
    label: 'April',
    value: 'APRIL',
  },
  {
    label: 'May',
    value: 'MAY',
  },
  {
    label: 'June',
    value: 'JUNE',
  },
  {
    label: 'July',
    value: 'JULY',
  },
  {
    label: 'August',
    value: 'AUGUST',
  },
  {
    label: 'September',
    value: 'SEPTEMBER',
  },
  {
    label: 'October',
    value: 'OCTOBER',
  },
  {
    label: 'November',
    value: 'NOVEMBER',
  },
  {
    label: 'December',
    value: 'DECEMBER',
  },
];

export const REVIEW_PROGRAM = [
  {
    label: 'Intensive',
    value: 'INTENSIVE',
  },
  {
    label: 'Enhancement-Intensive',
    value: 'ENHANCEMENT',
  },
];

export const PROCESSED_BY = [
  'Ma. Nelly Wendam',
  'Christine Dela Torre',
  'Elaine Mae Entreguena',
];

export const PAYMENT_METHODS = [
  {
    name: 'Bank Transfer',
    value: 'BANK',
  },
  {
    name: 'Cash',
    value: 'CASH',
  },
  {
    name: 'Gcash',
    value: 'GCASH',
  },
  {
    name: 'Check',
    value: 'CHECK',
  },
];
