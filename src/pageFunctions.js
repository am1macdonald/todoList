import { renderTasksToNav, wipeForm } from './pageControl.js';
import Task from './taskClass.js';

export const taskLibrary = (() => {    
    let arr = [      
      {"title":"6 task","description":"More stuff","dueDate":"2026-12-30","priority":"1","notes":"","checklist":{},"identifier":16408544564564},      
      {"title":"3","description":"123123","dueDate":"2023-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854693381},
      {"title":"4","description":"1231231231","dueDate":"2024-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854696682},
      {"title":"7","description":"123123","dueDate":"2027-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854645645645},
      {"title":"5 task","description":"stuff","dueDate":"2025-12-30","priority":"1","notes":"","checklist":{},"identifier":164085464564564},      
      {"title":"second task","description":"More stuff","dueDate":"2022-12-30","priority":"1","notes":"","checklist":{},"identifier":1640854644788},
      {"title":"8","description":"1231231231","dueDate":"2028-12-30","priority":"1","notes":"","checklist":{},"identifier":164085465675675},
      {"title":"first task","description":"stuff","dueDate":"2021-12-31","priority":"1","notes":"","checklist":{},"identifier":1640854644788}
    ];
    /* 
    if (window.localStorage.getItem('task-library')) {
      arr = JSON.parse(window.localStorage.getItem('task-library')).map(task => {
        return new Task(task.title, task.description, task.dueDate, task.priority, task.notes, task.checklist)
      });
    }
    */
    const show = () => arr;
    const addToLibrary = (task) => {
        arr.push(task);
        arr[arr.length-1].summary();
        //window.localStorage.setItem('task-library', JSON.stringify(arr));
    };
    return {
        addToLibrary,
        show,
    };
})();
//const projects = [];

export function addNewTask(e) {
    e.preventDefault();
    
    // array from text child nodes of form
    let nodeArr = 
    Array.from(document.getElementById('task-form').childNodes)
    .filter(node => node.tagName == 'INPUT' || node.tagName == 'SELECT')
    .map (node => {
      if (node.id === 'due-date') {
        return node.valueAsDate;
      }      else { 
        return node.value;
      }
    });
    // checks for contents of each child node
    for (let i = 0; i < nodeArr.length - 1; i++) {
        if (nodeArr[i].length == 0) {
            return console.error("err: missing fields");
        }
    }
     
    // gets contents of the checklist and stores them in an object
    let listItems = document.getElementsByClassName('checklist-item');
    let checklistObj = {};
    for (let item of listItems) {
        checklistObj[item.innerHTML.slice(2,item.innerHTML.length)] = false;
    }
    let newTask = new Task(...nodeArr, checklistObj);
    
    taskLibrary.addToLibrary(newTask);
    wipeForm();
    taskLibrary.show();
    renderTasksToNav();

}


