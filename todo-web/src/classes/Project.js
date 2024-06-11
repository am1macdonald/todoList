import { format } from "date-fns";
export default class Project {
  /** @public {Date}*/
  constructor(
    title,
    description,
    deadline,
    notes,
    tasks = [],
    id,
    complete = false
  ) {
    this.title = title;
    this.description = description;
    this.deadline = format(new Date(deadline), "yyyy-MM-dd");
    this.notes = notes;
    this.tasks = tasks;
    this.id = id;
    this.complete = complete;
  }

  toggleComplete() {
    if (this.complete === false) {
      this.complete = true;
    } else if (this.complete === true) {
      this.complete = false;
    }
  }

  edit(description, deadline, notes, tasks) {
    this.description = description;
    this.deadline = Math.floor(new Date('2012.08.10').getTime() / 1000)
    this.notes = notes;
    this.tasks = tasks.map(x => Number(x));
  }
}
