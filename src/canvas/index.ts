export interface Assignment {
  title: string;
  due: Date;
  summary: string;
  link: string;
  duration?: number;
}

export function getAssignments(): Assignment[] {
  return [];
}
