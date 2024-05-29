import { format } from "date-fns";

export default class Task {
  constructor(
    title,
    description,
    dueDate,
    priority = 1,
    notes,
    checklist = {},
    id,
    complete = false
  ) {
    this.title = title;
    this.description = description;
    this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
    this.id = id;
    this.complete = complete;
  }

  markComplete() {
    if (this.complete === true) {
      this.complete = false;
    } else if (this.complete === false) {
      this.complete = true;
    }
  }

  edit(description, dueDate, priority, notes, checklist) {
    this.description = description;
    this.dueDate = format(new Date(dueDate), "yyyy-MM-dd");
    this.priority = priority;
    this.notes = notes;
    this.checklist = checklist;
  }

  summary() {
    console.log(
      `I am task, ${this.title}, due on ${format(
        new Date(),
        "yyyy-MM-dd"
      )} with level ${this.priority} priority & id:${this.id}`
    );
  }
}
