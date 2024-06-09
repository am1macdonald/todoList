import { format } from "date-fns";

export default class Task {
  constructor(
    title,
    description,
    deadline,
    priority = 1,
    notes,
    id,
    complete = false
  ) {
    this.title = title;
    this.description = description;
    this.deadline = format(new Date(deadline), "yyyy-MM-dd");
    this.priority = priority;
    this.notes = notes;
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

  edit(description, deadline, priority, notes) {
    this.description = description;
    this.deadline = Math.floor(new Date(this.deadline).getTime() / 1000).toString();
    this.priority = priority;
    this.notes = notes;
  }
}
