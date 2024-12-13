export interface MenuItem {
    id: string;
    date: string;
    breakfast: string;
    dinner: string;
    noMenu?: boolean;
  }
  
  export interface MenuData {
    items: MenuItem[];
    lastUpdated: string;
  }
  
  export interface MonthlyMenuData {
    [key: string]: MenuData;
  }