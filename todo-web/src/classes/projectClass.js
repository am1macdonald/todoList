import { format } from "date-fns";
export default class Project {
  constructor(
    title,
    description,
    dueDate,
    notes,
    tasks = [],
    id,
    complete = false
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
    this.notes = notes;
    this.tasks = tasks;
    this.id = id;
    this.complete = complete;
  }

  markComplete() {
    if (this.complete === false) {
      this.complete = true;
    } else if (this.complete === true) {
      this.complete = false;
    }
  }

  edit(description, dueDate, notes, tasks) {
    this.description = description;
    this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
    this.notes = notes;
    this.tasks = tasks;
  }

  summary() {
    console.log(`I am project ${this.title}`);
  }
}
