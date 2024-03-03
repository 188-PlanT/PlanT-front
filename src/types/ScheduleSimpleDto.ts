export interface ScheduleSimpleDto {
  scheduleId : number;
  scheduleName: string;
  workspaceId: number;
  workspaceName : string;
  endDate: string;
  state : 'TODO' | 'INPROGRESS' | 'DONE';
  profile : string;
}
