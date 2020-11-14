export interface Assignment {
  title: string;
  due: Date;
  summary: string;
  link: string;
}

export function getAssignments(): Assignment[] {
  return [];
}
