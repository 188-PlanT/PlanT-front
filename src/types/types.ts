export enum PostStatus {
  IN_PROGRESS = 1,
  SUCCESS = 2,
  FAIL = 3,
}

export enum ScheduleStatus {
  TODO = 1,
  INPROGRESS = 2,
  DONE = 3,
}

export type ScheduleStatusType = 'TODO' | 'INPROGRESS' | 'DONE';