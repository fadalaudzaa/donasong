/**
 * aku cinta rupiah :D 
 * @param amount 
 * @returns 
 */
export const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * @param value - 
 * @returns 
 */
export const formatDonationInput = (value: string): string => {
  const number = value.replace(/[^0-9]/g, '');
  if (number === '') return '';
  return formatIDR(Number(number));
}; 