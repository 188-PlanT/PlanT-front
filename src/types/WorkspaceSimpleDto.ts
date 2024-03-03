export interface WorkspaceSimpleDto {
  workspaceId : number;
  workspaceName : string;
  profile : string;
  role: 'ADMIN' | 'USER' | 'PENDING';
}
