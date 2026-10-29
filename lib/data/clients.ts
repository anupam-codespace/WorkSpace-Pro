import { projects } from "@/lib/data/projects"

export type ClientStatus = "prospect" | "active" | "on_hold" | "completed" | "archived"

export type Client = {
  id: string
  name: string
  status: ClientStatus
  industry?: string
  website?: string
  location?: string
  owner?: string
  primaryContactName?: string
  primaryContactEmail?: string
  notes?: string
  segment?: string
  lastActivityLabel?: string
}

export const clients: Client[] = [
  {
    id: "acme",
    name: "Acme Corp",
    status: "active",
    industry: "Fintech",
    website: "https://acme.example",
    location: "Singapore",
    owner: "Anupam",
    primaryContactName: "Sarah Lee",
    primaryContactEmail: "sarah.lee@acme.example",
    notes: "Key strategic client with multiple ongoing projects spanning growth, retention, and internal tooling workstreams. Notes should demonstrate how longer paragraphs wrap and flow inside the drawer without breaking layout.",
    segment: "Enterprise",
    lastActivityLabel: "3 days ago",
  },
  {
    id: "healthplus",
    name: "HealthPlus",
    status: "prospect",
    industry: "Healthcare",
    website: "https://healthplus.example",
    location: "Australia",
    owner: "Alex Chen",
    primaryContactName: "Maria Gomez",
    primaryContactEmail: "maria.gomez@healthplus.example",
    notes: "Early stage discussions for a new platform redesign.",
    segment: "Prospect",
    lastActivityLabel: "Yesterday",
  },
  {
    id: "shopline",
    name: "Shopline Retail",
    status: "active",
    industry: "E-commerce",
    website: "https://shopline.example",
    location: "Vietnam",
    owner: "Anupam",
    primaryContactName: "Thanh Nguyen",
    primaryContactEmail: "thanh.nguyen@shopline.example",
    notes: "Multiple workstreams across web and mobile.",
    segment: "Growth",
    lastActivityLabel: "1 hour ago",
  },
  {
    id: "northwind",
    name: "Northwind Bank",
    status: "on_hold",
    industry: "Banking",
    website: "https://northwind.example",
    location: "United Kingdom",
    owner: "Emma Wright",
    primaryContactName: "Oliver Smith",
    primaryContactEmail: "oliver.smith@northwind.example",
    segment: "Enterprise",
    lastActivityLabel: "2 weeks ago",
  },
  {
    id: "atlas-logistics",
    name: "Atlas Logistics",
    status: "active",
    industry: "Logistics",
    website: "https://atlaslogistics.example",
    location: "Germany",
    owner: "Alex Morgan",
    primaryContactName: "Hannah Bauer",
    primaryContactEmail: "hannah.bauer@atlaslogistics.example",
    segment: "Mid-market",
    lastActivityLabel: "5 hours ago",
  },
  {
    id: "greenleaf",
    name: "GreenLeaf Health",
    status: "prospect",
    industry: "Healthcare",
    website: "https://greenleaf.example",
    location: "Canada",
    owner: "Sarah Chen",
    primaryContactName: "Daniel Ross",
    primaryContactEmail: "daniel.ross@greenleaf.example",
    segment: "Prospect",
    lastActivityLabel: "3 days ago",
  },
  {
    id: "stellar-pay",
    name: "StellarPay",
    status: "active",
    industry: "Payments",
    website: "https://stellarpay.example",
    location: "United States",
    owner: "Anupam",
    primaryContactName: "Linda Johnson",
    primaryContactEmail: "linda.johnson@stellarpay.example",
    segment: "Growth",
    lastActivityLabel: "Today",
  },
  {
    id: "orbit-travel",
    name: "Orbit Travel",
    status: "archived",
    industry: "Travel",
    website: "https://orbittravel.example",
    location: "Spain",
    owner: "Alex Chen",
    primaryContactName: "Carlos Diaz",
    primaryContactEmail: "carlos.diaz@orbittravel.example",
    segment: "SMB",
    lastActivityLabel: "6 months ago",
  },
  {
    id: "bright-edu",
    name: "Bright Education Group",
    status: "active",
    industry: "Education",
    website: "https://brightedu.example",
    location: "Singapore",
    owner: "Emma Wright",
    primaryContactName: "Grace Tan",
    primaryContactEmail: "grace.tan@brightedu.example",
    segment: "Mid-market",
    lastActivityLabel: "4 days ago",
  },
  {
    id: "nova-insights",
    name: "Nova Insights",
    status: "prospect",
    industry: "Analytics",
    website: "https://novainsights.example",
    location: "United States",
    owner: "Sarah Chen",
    primaryContactName: "Ethan Lee",
    primaryContactEmail: "ethan.lee@novainsights.example",
    segment: "Prospect",
    lastActivityLabel: "2 hours ago",
  },
  {
    id: "harbor-retail",
    name: "Harbor Retail Group",
    status: "on_hold",
    industry: "Retail",
    website: "https://harborretail.example",
    location: "Australia",
    owner: "Anupam",
    primaryContactName: "Amelia Clark",
    primaryContactEmail: "amelia.clark@harborretail.example",
    segment: "SMB",
    lastActivityLabel: "1 month ago",
  },
  {
    id: "quantum-hr",
    name: "Quantum HR Solutions",
    status: "active",
    industry: "HR Tech",
    website: "https://quantumhr.example",
    location: "Netherlands",
    owner: "Alex Morgan",
    primaryContactName: "Noah Visser",
    primaryContactEmail: "noah.visser@quantumhr.example",
    segment: "Mid-market",
    lastActivityLabel: "Yesterday",
  },
  {
    id: "sunrise-homes",
    name: "Sunrise Homes",
    status: "active",
    industry: "Real Estate",
    website: "https://sunrisehomes.example",
    location: "Vietnam",
    owner: "Anupam",
    primaryContactName: "Minh Tran",
    primaryContactEmail: "minh.tran@sunrisehomes.example",
    segment: "SMB",
    lastActivityLabel: "5 days ago",
  },
  {
    id: "polar-tech",
    name: "Polar Tech Labs",
    status: "prospect",
    industry: "SaaS",
    website: "https://polartech.example",
    location: "Sweden",
    owner: "Sarah Chen",
    primaryContactName: "Sofia Lind",
    primaryContactEmail: "sofia.lind@polartech.example",
    segment: "Prospect",
    lastActivityLabel: "Today",
  },
  {
    id: "metro-media",
    name: "Metro Media",
    status: "archived",
    industry: "Media",
    website: "https://metromedia.example",
    location: "United States",
    owner: "Alex Chen",
    primaryContactName: "James Carter",
    primaryContactEmail: "james.carter@metromedia.example",
    segment: "Enterprise",
    lastActivityLabel: "1 year ago",
  },
  {
    id: "alpha-sports",
    name: "Alpha Sports",
    status: "active",
    industry: "Sports",
    website: "https://alphasports.example",
    location: "Canada",
    owner: "Emma Wright",
    primaryContactName: "Lucas Martin",
    primaryContactEmail: "lucas.martin@alphasports.example",
    segment: "Growth",
    lastActivityLabel: "2 days ago",
  },
  {
    id: "zen-finance",
    name: "Zen Finance",
    status: "on_hold",
    industry: "Fintech",
    website: "https://zenfinance.example",
    location: "Hong Kong",
    owner: "Anupam",
    primaryContactName: "Karen Wong",
    primaryContactEmail: "karen.wong@zenfinance.example",
    segment: "Mid-market",
    lastActivityLabel: "3 weeks ago",
  },
  {
    id: "vista-energy",
    name: "Vista Energy",
    status: "active",
    industry: "Energy",
    website: "https://vistaenergy.example",
    location: "United States",
    owner: "Alex Morgan",
    primaryContactName: "Robert King",
    primaryContactEmail: "robert.king@vistaenergy.example",
    segment: "Enterprise",
    lastActivityLabel: "8 hours ago",
  },
  {
    id: "cloudworks",
    name: "CloudWorks Studio",
    status: "prospect",
    industry: "Design",
    website: "https://cloudworks.example",
    location: "France",
    owner: "Sarah Chen",
    primaryContactName: "Chloe Dubois",
    primaryContactEmail: "chloe.dubois@cloudworks.example",
    segment: "Prospect",
    lastActivityLabel: "4 hours ago",
  },
  {
    id: "rapid-lanes",
    name: "Rapid Lanes Logistics",
    status: "active",
    industry: "Logistics",
    website: "https://rapidlanes.example",
    location: "Malaysia",
    owner: "Emma Wright",
    primaryContactName: "Ahmad Zain",
    primaryContactEmail: "ahmad.zain@rapidlanes.example",
    segment: "SMB",
    lastActivityLabel: "Yesterday",
  },
  {
    id: "horizon-foods",
    name: "Horizon Foods",
    status: "archived",
    industry: "FMCG",
    website: "https://horizonfoods.example",
    location: "Thailand",
    owner: "Anupam",
    primaryContactName: "Ananda Chai",
    primaryContactEmail: "ananda.chai@horizonfoods.example",
    segment: "Mid-market",
    lastActivityLabel: "9 months ago",
  },
]

export function getClientById(id: string): Client | undefined {
  return clients.find((c) => c.id === id)
}

export function getProjectCountForClient(clientName: string): number {
  return projects.filter((p) => p.client === clientName).length
}

export function getClientByName(name: string): Client | undefined {
  const normalized = name.trim().toLowerCase()
  return clients.find((c) => c.name.trim().toLowerCase() === normalized)
}

// Mock-only helper to simulate create/edit in-memory for UX flows.
export function upsertClient(input: Client): Client {
  const existingIndex = clients.findIndex((c) => c.id === input.id)
  if (existingIndex >= 0) {
    clients[existingIndex] = { ...clients[existingIndex], ...input }
    return clients[existingIndex]
  }
  clients.push(input)
  return input
}
