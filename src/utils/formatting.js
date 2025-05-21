import { DateTime } from 'luxon';

export const formatDate = (dateVal) => {
  const date = DateTime.fromISO(dateVal);
  const formattedDate = date.toFormat('MMM dd, yyyy');
  return formattedDate;
};
export const formatSemester = (semester) => {
  if (semester === 'FIRST_SEMESTER') {
    return '1ST';
  } else if (semester === 'SECOND_SEMESTER') {
    return '2ND';
  }

  return semester;
};

export const formatTakerType = (takerType) => {
  if (takerType === 'FIRST_TAKER') {
    return '1st Taker';
  } else if (takerType === 'RE_TAKER') {
    return 'Re-taker';
  } else if (takerType === 'SUMMER') {
    return 'Summer';
  }
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

export const cleanParams = (obj) => {
  Object.keys(obj).forEach((key) => {
    if (obj[key] === undefined || obj[key] === '' || obj[key] === 'all') {
      delete obj[key];
    }
  });
  return obj;
};

export const getCourseOfferingName = (offering) => {
  if (!offering) return null;
  const { course, reviewProgram, yearOffered, semester } = offering;
  return `${course?.name}-${reviewProgram?.name?.substring(
    0,
    3
  )}-${yearOffered}-${semester}`;
};

export const toSafeNumber = (value) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
};
