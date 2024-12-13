import { MenuItem } from './menu';

export interface CalendarDay {
    day : number;
    menuItem : MenuItem & { noMenu?: boolean; };
    isToday : boolean;
}