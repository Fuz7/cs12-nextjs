export type Customer ={
  id: string | number;
  first_name: string;
  last_name: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  billing_address: string | null;
  property_address: string | null;
  lead_source: string | null;
  created_at: string;
  updated_at: string;
}

export const currencyCharacter = "₱" 