import dayjs from "dayjs";

export default class Task {
  /**
   * @param {string} title
   * @param {string} description
   * @param {string} deadline
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
    this.deadline = deadline;
    this.priority = Number(priority);
    this.notes = notes;
    this.id = Number(id);
    this.complete = complete;
    this._hidden = true;
  }

  toggleComplete() {
    if (this.complete === true) {
      this.complete = false;
    } else if (this.complete === false) {
      this.complete = true;
    }
  }

  toggleHidden() {
    this._hidden = !this._hidden;
  }

  get hidden() {
    return this._hidden;
  }

  /**
   * @param {string} description
   * @param {string} deadline
   * @param {number} priority
   * @param {string} notes
   */
  edit(description, deadline, priority, notes) {
    this.description = description;
    this.deadline = dayjs(deadline).toISOString();
    this.priority = Number(priority);
    this.notes = notes;
  }

  get formattedDate() {
    return dayjs(this.deadline.split("T")[0], "YYYY-MM-DD").format("YYYY-MM-DD");
  }
}
