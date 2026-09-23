export type RequestContext = {
  organizationId?: string | null | undefined;
  workspaceId?: string | null | undefined;
  requestId?: string | undefined;
  operationId?: string | undefined;
  idempotencyKey?: string | undefined;
  expectedVersion?: string | undefined;
  deadlineMs?: number | undefined;
};

export type ApiMeta = {
  requestId: string;
  timestamp: string;
  version?: string;
};

export type ApiEnvelope<T> = {
  data: T;
  meta: ApiMeta;
};

export type PageInfo = {
  cursor?: string | null;
  hasNextPage: boolean;
};

export type Paginated<T> = {
  items: T[];
  pageInfo: PageInfo;
};

export type DecisionReceiptRef = {
  receiptId: string;
  approvalId?: string;
  policyVerdict: "allow" | "approval_required" | "blocked";
  verificationState: "pending" | "verified" | "failed";
};
