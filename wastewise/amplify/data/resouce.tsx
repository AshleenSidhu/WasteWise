//import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
//import { postConfirmation } from "../auth/post-confirmation/resource";
/*== STEP 1 ===============================================================
Create a data resource to hold your Amplify Client Schema
=========================================================================*/
// TypeScript interface for a waste bin resource
export interface Coordinates {
	lat: number;
	lng: number;
}

export type BinType = "recycle" | "compost" | "landfill";
export type BinStatus = "active" | "missing" | "damaged";

export interface BinResource {
	binId: string; // uuid
	type: BinType;
	coordinates: Coordinates;
	address?: string;
	fullnessLevel?: number; // 0.0 - 1.0
	accessibility?: string[]; // e.g. ["wheelchair-accessible"]
	city?: string;
	createdAt?: number; // epoch ms
	createdBy?: string;
	lastCheckedAt?: number; // epoch ms
	status?: BinStatus;
}

// JSON Schema equivalent for runtime validation / documentation
export const BIN_SCHEMA = {
	$schema: "http://json-schema.org/draft-07/schema#",
	title: "BinResource",
	type: "object",
	required: ["binId", "type", "coordinates"],
	properties: {
		binId: { type: "string" },
		type: { type: "string", enum: ["recycle", "compost", "landfill"] },
		coordinates: {
			type: "object",
			required: ["lat", "lng"],
			properties: {
				lat: { type: "number" },
				lng: { type: "number" },
			},
		},
		address: { type: "string" },
		fullnessLevel: { type: "number", minimum: 0, maximum: 1 },
		accessibility: { type: "array", items: { type: "string" } },
		city: { type: "string" },
		createdAt: { type: "number" },
		createdBy: { type: "string" },
		lastCheckedAt: { type: "number" },
		status: { type: "string", enum: ["active", "missing", "damaged"] },
	},
	additionalProperties: false,
} as const;

// Lightweight runtime type guard (no external deps)
export function isBinResource(obj: unknown): obj is BinResource {
	if (obj === null || typeof obj !== "object") return false;
	const o = obj as Record<string, unknown>;

	if (typeof o.binId !== "string") return false;

	if (typeof o.type !== "string" || !["recycle", "compost", "landfill"].includes(o.type)) return false;

	if (!o.coordinates || typeof o.coordinates !== "object") return false;
	const coords = o.coordinates as Record<string, unknown>;
	const lat = coords.lat;
	const lng = coords.lng;
	if (typeof lat !== "number" || typeof lng !== "number") return false;

	if (o.fullnessLevel !== undefined) {
		if (typeof o.fullnessLevel !== "number") return false;
		const fl = o.fullnessLevel as number;
		if (fl < 0 || fl > 1) return false;
	}

	if (o.accessibility !== undefined) {
		if (!Array.isArray(o.accessibility)) return false;
		if (!(o.accessibility as unknown[]).every((s: unknown) => typeof s === "string")) return false;
	}

	if (o.status !== undefined) {
		if (typeof o.status !== "string") return false;
		if (!["active", "missing", "damaged"].includes(o.status)) return false;
	}

	if (o.createdAt !== undefined && typeof o.createdAt !== "number") return false;
	if (o.lastCheckedAt !== undefined && typeof o.lastCheckedAt !== "number") return false;

	return true;
}

/* Example usage:
const sample = {
	binId: "uuid",
	type: "recycle",
	coordinates: { lat: 51.0486, lng: -114.0708 },
	address: "123 7 Ave SW, Calgary",
	fullnessLevel: 0.32,
	accessibility: ["wheelchair-accessible"],
	city: "Calgary",
	createdAt: 1731038400000,
	createdBy: "user-123",
	lastCheckedAt: 1731042000000,
	status: "active",
}

if (isBinResource(sample)) {
	// TypeScript now knows `sample` is `BinResource`.
	console.log('valid bin', sample.binId);
} else {
	console.warn('invalid bin');
}
*/

