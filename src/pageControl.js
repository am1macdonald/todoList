import { Task, Project } from './todo.js';

function pageLoad(){


    let task2 = new Task('task2', 2, 3, 4, 5, 6);
    let project1 = new Project('project1', 2, 3, 4, 5);
    console.log(task2, project1);
    task2.announce();
}

export {
    pageLoad
}