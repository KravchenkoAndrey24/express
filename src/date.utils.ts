export const hasPassedHours = (date: string | Date, hours: number) => {
  const now = new Date();
  const differenceInMilliseconds = now.getTime() - new Date(date).getTime();
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);
  return differenceInHours >= hours;
};
