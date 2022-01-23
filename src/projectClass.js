import { format } from 'date-fns';
export default class Project {
    constructor(title, description, dueDate, notes, tasks = [], complete = false) {
        this.title = title;
        this.description = description;
        this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
        this.notes = notes;
        this.tasks = tasks;
        this.complete = complete;
    }
    markComplete() {
        if (this.complete === false) {
          this.complete = true;
        } else if (this.complete === true) {
          this.complete = false;
      }
    }
    edit(description, dueDate, notes) {
      this.description = description;
      this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
      this.notes = notes;

    }
    summary() {
        console.log(`I am project ${this.title}`);
    }
}