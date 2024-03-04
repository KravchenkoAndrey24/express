export const hasPassedHours = (date: string | Date, hours: number) => {
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - new Date(date).getTime();
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  return differenceInHours >= hours;
};

export const areDatesEqual = (date1?: string, date2?: string) => {
  if (!date1 || !date2) {
    return false;
  }

  // (YYYY-MM)
  const [year1, month1] = date1.split('-').map(Number);
  const dateObj1 = new Date(year1, month1 - 1); // Місяці відлікуються з 0 у JavaScript

  // (MMM YYYY)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [monthName, year2] = date2.split(' ');
  const month2 = monthNames.indexOf(monthName);
  const dateObj2 = new Date(Number(year2), month2);

  return dateObj1.getFullYear() === dateObj2.getFullYear() && dateObj1.getMonth() === dateObj2.getMonth();
};
