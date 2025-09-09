export interface Adventure {
  id: string;
  title: string;
  icon: string;
  timestamp: Date;
}

export interface AdventureStats {
  totalThisWeek: number;
  mostUsedIcon: {
    icon: string;
    count: number;
  } | null;
}