import './todo.js'
import { Task } from './todo.js';

const taskLibrary = [];

const projects = {
}

export function addNewTask(e) {
    e.preventDefault();
    console.log('adding new task');

    let nodeArr = 
    Array.from(document.getElementById('task-form').childNodes)
    .filter(node => node.tagName == 'INPUT' || node.tagName == 'SELECT')
    .map (node => node.value);

    console.log(nodeArr);

    for (let i = 0; i < nodeArr.length - 1; i++) {
        if (nodeArr[i].length == 0) {
            return console.error("sry");
        }
    };
     
    let listItems = document.getElementsByClassName('checklist-item');
    let checklistObj = {};
    for (let item of listItems) {
        checklistObj[item.innerHTML.slice(2,item.innerHTML.length)] = false;
    };
    let newTask = new Task(...nodeArr, checklistObj);
    newTask.summary();

    
    taskLibrary.push(newTask);

    console.log(taskLibrary);


}


