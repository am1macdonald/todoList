export default class Project {
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