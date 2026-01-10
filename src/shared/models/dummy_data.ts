import { WorkCenterDocument, WorkOrderDocument, WorkOrderStatus } from "./interfaces";

// ---------- Work Centers (50) ----------
export const WORK_CENTERS: WorkCenterDocument[] = Array.from(
	{ length: 50 },
	(_, i) => ({
		docId: `wc-${i + 1}`,
		docType: 'workCenter',
		data: {
			name: `Work Center ${i + 1}`,
		},
	})
);

// ---------- Work Orders (500) ----------
const statuses: WorkOrderStatus[] = ['open', 'in-progress', 'complete', 'blocked'];

export const WORK_ORDERS: WorkOrderDocument[] = Array.from(
	{ length: 500 },
	(_, i) => {
		const start = new Date(2025, 0, 1 + (i % 60));
		const end = new Date(start.toISOString());
		end.setDate(start.getDate() + (i % 10) + 1);

		return {
			docId: `wo-${i + 1}`,
			docType: 'workOrder',
			data: {
				name: `Work Order ${i + 1}`,
				workCenterId: WORK_CENTERS[i % WORK_CENTERS.length].docId,
				status: statuses[i % statuses.length],
				startDate: start.toISOString().split('T')[0],
				endDate: end.toISOString().split('T')[0],
			},
		};
	}
);
