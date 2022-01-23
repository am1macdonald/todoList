import { format } from 'date-fns';
export default class Task {
    constructor(title, description, dueDate,  priority = 1, notes, checklist = {}, identifier, complete = false) {
        this.title = title;
        this.description = description;
        this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        if (typeof identifier === 'number') {
          this.identifier = identifier;
        } else {
        this.identifier = Date.now();
        }
        this.complete = complete;
    }
    markComplete() {
        if (this.complete === true) {
            this.complete = false;
        } else if (this.complete === false) {
            this.complete = true;
        }
    }
    edit(description, dueDate, priority, notes) {
      this.description = description;
      this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
      this.priority = priority;
      this.notes = notes;
    }
    summary() {
        console.log(`I am task, ${this.title}, due on ${format(new Date(), 'yyyy-MM-dd')} with level ${this.priority} priority & id:${this.identifier}`);
    }
}
