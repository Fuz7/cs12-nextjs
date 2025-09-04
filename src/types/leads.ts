export interface Lead extends Record<string, unknown> {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  status: LeadStatus;
  source?: LeadSource;
  notes?: string;
  created_at: string;
  updated_at: string;
}
export interface PaginatedLeadResponse {
  current_page: number;
  data: Lead[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}
export const LEAD_STATUSES = [
  {
    value: "new",
    label: "New",
    color: "bg-blue-100 text-blue-800",
    entry: [""],
  },
  {
    value: "contacted",
    label: "Contacted",
    color: "bg-yellow-100 text-yellow-800",
    hover: "hover:bg-yellow-100/90 hover:text-yellow-800/90",
    entry: ["new"],
  },
  {
    value: "qualified",
    label: "Qualified",
    color: "bg-purple-100 text-purple-800",
    hover: "hover:bg-purple-100/90 hover:text-purple-800/90",
    entry: ["contacted"],
  },
  {
    value: "converted",
    label: "Converted",
    color: "bg-green-100 text-green-800",
    hover: "hover:bg-green-100/90 hover:text-green-800/90",
    entry: [""],
  },
  {
    value: "lost",
    label: "Lost",
    color: "bg-red-100 text-red-800",
    hover: "hover:bg-red-100/90 hover:text-red-800/90",
    entry: ["contacted", "qualified"],
  },
];

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "lost";

export enum LeadSource {
  Website = "Website",
  Referral = "Referral",
  SocialMedia = "Social Media",
  EmailCampaign = "Email Campaign",
  PhoneCall = "Phone Call",
  TradeShow = "Trade Show",
  Advertisement = "Advertisement",
  ColdOutreach = "Cold Outreach",
  Other = "Other",
}
export interface CreateLeadData {
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  source?: LeadSource | "";
  notes?: string;
}

export interface UpdateLeadData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  company?: string;
  status?: LeadStatus;
  source?: LeadSource | "";
  notes?: string;
  assigned_to?: string;
}

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "Social Media",
  "Email Campaign",
  "Phone Call",
  "Trade Show",
  "Advertisement",
  "Cold Outreach",
  "Other",
] as const;
