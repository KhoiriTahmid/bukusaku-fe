import type { TransactionType } from "./type";

export interface TransactionCategoryOption {
  label: string;
  value: string;
  color: string;
}

const INCOME_CATEGORIES: TransactionCategoryOption[] = [
  { label: "Salary", value: "SALARY", color: "#52C41A" },
  { label: "Freelance", value: "FREELANCE", color: "#13C2C2" },
  { label: "Investment", value: "INVESTMENT", color: "#2F54EB" },
  { label: "Business", value: "BUSINESS", color: "#722ED1" },
  { label: "Bonus", value: "BONUS", color: "#FAAD14" },
  { label: "Gift / Allowance", value: "GIFT_ALLOWANCE", color: "#EB2F96" },
  { label: "Other Income", value: "OTHER_INCOME", color: "#8C8C8C" },
];

const EXPENSE_CATEGORIES: TransactionCategoryOption[] = [
  { label: "Food & Beverage", value: "FOOD_BEVERAGE", color: "#FF4D4F" },
  { label: "Groceries", value: "GROCERIES", color: "#FF7A45" },
  { label: "Transportation", value: "TRANSPORTATION", color: "#FA8C16" },
  { label: "Shopping", value: "SHOPPING", color: "#FADB14" },
  { label: "Entertainment", value: "ENTERTAINMENT", color: "#9254DE" },
  { label: "Housing", value: "HOUSING", color: "#1890FF" },
  { label: "Utilities", value: "UTILITIES", color: "#36CFC9" },
  { label: "Subscriptions", value: "SUBSCRIPTIONS", color: "#B37FEB" },
  { label: "Debt & Loans", value: "DEBT_LOANS", color: "#CF1322" },
  { label: "Health & Care", value: "HEALTH_CARE", color: "#FF85C0" },
  { label: "Education", value: "EDUCATION", color: "#1D39C4" },
  { label: "Insurance", value: "INSURANCE", color: "#597EF7" },
  { label: "Donation & Charity", value: "DONATION_CHARITY", color: "#73D13D" },
  { label: "Family & Gift", value: "FAMILY_GIFT", color: "#FFC069" },
  {
    label: "Savings & Investment",
    value: "SAVINGS_INVESTMENT",
    color: "#389E0D",
  },
  { label: "Other Expense", value: "OTHER_EXPENSE", color: "#BFBFBF" },
];

export const CATEGORIES_BY_TYPE: Record<
  TransactionType,
  TransactionCategoryOption[]
> = {
  INCOME: INCOME_CATEGORIES,
  EXPENSE: EXPENSE_CATEGORIES,
};

export const TRANSACTION_CATEGORIES = [
  ...INCOME_CATEGORIES,
  ...EXPENSE_CATEGORIES,
];

export const getCategory = (value: string) =>
  TRANSACTION_CATEGORIES.find((c) => c.value === value);

export const CATEGORY_GROUPED_OPTIONS = [
  {
    label: "Income",
    options: CATEGORIES_BY_TYPE.INCOME.map((c) => ({
      value: c.value,
      label: c.label,
    })),
  },
  {
    label: "Expense",
    options: CATEGORIES_BY_TYPE.EXPENSE.map((c) => ({
      value: c.value,
      label: c.label,
    })),
  },
];
