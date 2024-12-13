export interface MenuItem {
    date: string;
    breakfast: string;
    dinner: string;
  }
  
  export interface MenuData {
    items: MenuItem[];
    lastUpdated: string;
  }
  
  export interface MonthlyMenuData {
    [key: string]: MenuData;
  }