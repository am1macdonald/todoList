import './todo.js'
import { Task } from './todo.js';

export const taskLibrary = () => {
    
    const arr = [];
    const addToLibrary = (task) => {
        arr.push(task);
        arr[arr.length-1].summary();
    }
    return {
        addToLibrary
    }

};
const projects = [];

export function addNewTask(e) {
    e.preventDefault();
    
    console.log('adding new task');

    // array from text child nodes of form
    let nodeArr = 
    Array.from(document.getElementById('task-form').childNodes)
    .filter(node => node.tagName == 'INPUT' || node.tagName == 'SELECT')
    .map (node => node.value);

    console.log(nodeArr);

    // checks for contents of each child node
    for (let i = 0; i < nodeArr.length - 1; i++) {
        if (nodeArr[i].length == 0) {
            return console.error("sry");
        };
    };
     
    // gets contents of the checklist and stores them in an object
    let listItems = document.getElementsByClassName('checklist-item');
    let checklistObj = {};
    for (let item of listItems) {
        checklistObj[item.innerHTML.slice(2,item.innerHTML.length)] = false;
    };
    let newTask = new Task(...nodeArr, checklistObj);
    
    taskLibrary().addToLibrary(newTask);

    document.getElementById('form-container').style.display = 'none'; 

}


