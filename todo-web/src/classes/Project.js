import { format } from "date-fns";

export default class Project {
  /**
   * @param {string} title
   * @param {string} description
   * @param {number} deadline
   * @param {string} notes
   * @param {Array<number>} tasks
   * @param {number} id
   * @param {boolean} complete
   */
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
    this.deadline = Number(deadline);
    this.notes = notes;
    this.tasks = tasks.map(x => Number(x));
    this.id = Number(id);
    this.complete = complete;
  }

  toggleComplete() {
    if (this.complete === false) {
      this.complete = true;
    } else if (this.complete === true) {
      this.complete = false;
    }
  }

  /**
   * @param {string} description
   * @param {number} deadline
   * @param {string} notes
   * @param {Array<number>} tasks
   */
  edit(description, deadline, notes, tasks) {
    this.description = description;
    this.deadline = Number(deadline);
    this.notes = notes;
    this.tasks = tasks.map(x => Number(x));
  }
}
