export interface MenuItem {
    date: string;
    breakfast: string;
    dinner: string;
  }
  
  export type MenuData = {
    [monthKey: string]: {
      items: MenuItem[];
      lastUpdated: string;
    };
  };