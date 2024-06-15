import moment from "moment";

export default class Project {

  /**
   * @param {string} title
   * @param {string} description
   * @param {string} deadline
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
    this.deadline = deadline;
    this.notes = notes;
    this.tasks = tasks.map(x => Number(x));
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
   * @param {string} notes
   * @param {Array<number>} tasks
   */
  edit(description, deadline, notes, tasks) {
    this.description = description;
    this.deadline = moment(deadline).toISOString();
    this.notes = notes;
    this.tasks = tasks.map(x => Number(x));
  }

  get formattedDate() {
    return moment(this.deadline.split("T")[0], "YYYY-MM-DD").format("YYYY-MM-DD");
  }
}
