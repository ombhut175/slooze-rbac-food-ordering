import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency amount based on currency type
 * @param cents - Amount in cents
 * @param currency - Currency code (INR or USD)
 * @returns Formatted currency string
 */
export function formatCurrency(cents: number, currency: 'INR' | 'USD'): string {
  const amount = cents / 100;
  
  if (currency === 'INR') {
    // Indian Rupee format: ₹1,234.56
    return `₹${amount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }
  
  // US Dollar format: $1,234.56
  return `$${amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Get currency symbol for a given currency code
 * @param currency - Currency code (INR or USD)
 * @returns Currency symbol
 */
export function getCurrencySymbol(currency: 'INR' | 'USD'): string {
  return currency === 'INR' ? '₹' : '$';
}

/**
 * Get country name from country code
 * @param country - Country code (IN or US)
 * @returns Full country name
 */
export function getCountryName(country: 'IN' | 'US'): string {
  return country === 'IN' ? 'India' : 'United States';
}

/**
 * Get country flag emoji from country code
 * @param country - Country code (IN or US)
 * @returns Flag emoji
 */
export function getCountryFlag(country: 'IN' | 'US'): string {
  return country === 'IN' ? '🇮🇳' : '🇺🇸';
}
