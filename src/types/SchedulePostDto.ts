export interface SchedulePostDto {
  name: string;
  users: number[];
  startDate: string;
  endDate: string;
  state : 'TODO' | 'INPROGRESS' | 'DONE';
  content : string;
};
