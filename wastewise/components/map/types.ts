export type Bin = {
  binId: string;
  type: "recycle" | "compost" | "landfill";
  coordinates: { lat: number; lng: number };
  address?: string;
  fullnessLevel?: number; // 0..1
  accessibility?: string[];
  city?: string;
  createdAt?: number;
  createdBy?: string;
  lastCheckedAt?: number;
  status?: "active" | "missing" | "damaged";
};
