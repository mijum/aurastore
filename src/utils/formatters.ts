export const formatBDT = (amount: number): string => {
  return `৳${Math.round(amount).toLocaleString('en-BD')}`;
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const isValidBDPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[\s-]/g, '');
  // Matches 01XXXXXXXXX or +8801XXXXXXXXX or 8801XXXXXXXXX
  const regex = /^(?:\+88|88)?(01[3-9]\d{8})$/;
  return regex.test(cleaned);
};

export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const calculateDiscountPercentage = (price: number, discountPrice?: number): number => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};
