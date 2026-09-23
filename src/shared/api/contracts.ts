export type RequestContext = {
  organizationId?: string | null;
  workspaceId?: string | null;
  requestId?: string;
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
