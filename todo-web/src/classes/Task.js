import { format } from "date-fns";

export default class Task {
  /**
   * @param {string} title
   * @param {string} description
   * @param {number} deadline
   * @param {number} priority
   * @param {string} notes
   * @param {number} id
   * @param {boolean} complete
   */
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
    this.deadline = Number(deadline);
    this.priority = Number(priority);
    this.notes = notes;
    this.id = Number(id);
    this.complete = complete;
  }

  markComplete() {
    if (this.complete === true) {
      this.complete = false;
    } else if (this.complete === false) {
      this.complete = true;
    }
  }

  /**
   * @param {string} description
   * @param {number} deadline
   * @param {number} priority
   * @param {string} notes
   */
  edit(description, deadline, priority, notes) {
    this.description = description;
    this.deadline = Number(deadline);
    this.priority = Number(priority);
    this.notes = notes;
  }
}
