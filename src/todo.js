export class Task {
    constructor(title, description, dueDate,  priority = 1, notes, checklist = {}) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.notes = notes;
        this.checklist = checklist;
    }
    summary() {
        console.log(`I am task, ${this.title}, due on ${this.dueDate} with level ${this.priority} priority`);
    }
}
export class Project {
    constructor(title, description, dueDate, notes, tasks = []) {
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.notes = notes;
        this.tasks = tasks;
    }
    announce() {
        console.log(`I am project ${this.title}`);
    }
}