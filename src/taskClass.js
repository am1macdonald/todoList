export default class Task {
    constructor(title, description, dueDate,  priority = 1, notes, checklist = {}) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
        this.identifier = Date.now();
    }
    summary() {
        console.log(`I am task, ${this.title}, due on ${this.dueDate} with level ${this.priority} priority & id:${this.identifier}`);
    }
}