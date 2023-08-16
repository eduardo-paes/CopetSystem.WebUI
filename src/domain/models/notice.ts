export interface Notice {
	id?: string;
	registrationStartDate: Date;
	registrationEndDate: Date;
	evaluationStartDate: Date;
	evaluationEndDate: Date;
	appealStartDate: Date;
	appealEndDate: Date;
	sendingDocsStartDate: Date;
	sendingDocsEndDate: Date;
	suspensionYears: number;
	partialReportDeadline: Date;
	finalReportDeadline: Date;
	docUrl?: string;
	description?: string;
	deletedAt?: Date;
}