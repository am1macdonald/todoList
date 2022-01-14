import { format } from 'date-fns';
export default class Project {
    constructor(title, description, dueDate, notes, tasks = []) {
        this.title = title;
        this.description = description;
        this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
        this.notes = notes;
        this.tasks = tasks;
        this.complete = false;
    }
    markComplete(bool) {
      if (bool === true) {
          this.complete = true;
      } else if (bool === false) {
          this.complete = false;
      }
  }
    summary() {
        console.log(`I am project ${this.title}`);
    }
}