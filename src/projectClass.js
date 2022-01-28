import { format } from 'date-fns'
export default class Project {
  constructor (title, description, dueDate, notes, tasks = [], identifier, complete = false) {
    this.title = title
    this.description = description
    this.dueDate = format(new Date(dueDate), 'yyyy-MM-dd')
    this.notes = notes
    this.tasks = tasks
    if (typeof identifier === 'number') {
      this.identifier = identifier
    } else {
      this.identifier = Date.now()
    }
    this.complete = complete
  }

  markComplete () {
    if (this.complete === false) {
      this.complete = true
    } else if (this.complete === true) {
      this.complete = false
    }
  }

  edit (description, dueDate, notes, tasks) {
    this.description = description
    this.dueDate = format(new Date(dueDate), 'yyyy-MM-dd')
    this.notes = notes
    this.tasks = tasks
  }

  summary () {
    console.log(`I am project ${this.title}`)
  }
}
