import moment from "moment";

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
  }

  toggleComplete() {
    if (this.complete === true) {
      this.complete = false;
    } else if (this.complete === false) {
      this.complete = true;
    }
  }

  /**
   * @param {string} description
   * @param {string} deadline
   * @param {number} priority
   * @param {string} notes
   */
  edit(description, deadline, priority, notes) {
    this.description = description;
    this.deadline = moment(deadline).toISOString();
    this.priority = Number(priority);
    this.notes = notes;
  }

  get formattedDate() {
    console.log(this.deadline)
    return moment(this.deadline.split('T')[0], 'YYYY-MM-DD').format('YYYY-MM-DD');
  }
}
