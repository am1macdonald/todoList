import { format } from 'date-fns';
export default class Task {
    constructor(title, description, dueDate,  priority = 1, notes, checklist = {}) {
        this.title = title;
        this.description = description;
        this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.identifier = Date.now();
    }
    summary() {
        console.log(`I am task, ${this.title}, due on ${format(new Date(), 'yyyy-MM-dd')} with level ${this.priority} priority & id:${this.identifier}`);
    }
}
