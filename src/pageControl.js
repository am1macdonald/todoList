import { Task, Project } from './todo.js';
import { format } from 'date-fns';



function pageLoad(){

    const content = document.getElementById('content');


    // create the popup for adding new tasks

    const dataInputWindow = function() {

        // creates a new popup for task / project entry

        const newFormWindow = (type) => {
            // div to hold the data form
            const container = document.createElement('div');
            container.id = 'form-container';

            // form header
            const formHeader = document.createElement('h3');
            formHeader.innerHTML = `New ${type}`;

            // form to hold the items
            const form = document.createElement('form');
            form.name = `${type} creation form`;
            form.id = `${type.toLowerCase()}-form`;

            form.appendChild(formHeader);
            container.appendChild(form);
            content.appendChild(container);
        }

        const newTextInput = (parent, name, labelText, placeholder) => {
            const label = document.createElement('label');
            label.for = name;
            label.innerHTML = labelText;
            const input = document.createElement('input');
            input.id = name;
            input.type = 'text';
            input.placeholder = placeholder;

            parent.appendChild(label);
            parent.appendChild(input);
        }
        
        // input for the task deadline
        const dueDateLabel = document.createElement('label');
        dueDateLabel.for = 'due-date';
        dueDateLabel.innerHTML = 'What is the deadline?';
        const dueDateInput = document.createElement('input');
        dueDateInput.id = 'due-date';
        dueDateInput.type = 'date';
        dueDateInput.min = `${format(new Date(), 'yyyy-MM-dd')}`;
        dueDateInput.value = `${format(new Date(), 'yyyy-MM-dd')}`

        // input for the task priority
        const priorityLabel = document.createElement('label');
        priorityLabel.for = 'priority';
        priorityLabel.innerHTML = 'How important is the task?';
        const priorityInput = document.createElement('select');
        priorityInput.id = 'priority';
        const priorityOptions = [1,2,3,4,5];
        for (let num of priorityOptions) {
            let newOption = document.createElement('option');
            newOption.value = num.toString();
            newOption.innerHTML = num.toString()
            priorityInput.appendChild(newOption);
        }

        // input for the task notes
        const notesLabel = document.createElement('label');
        notesLabel.for = 'notes';
        notesLabel.innerHTML = 'Notes:';
        const notesInput = document.createElement('input');
        notesInput.id = 'notes';
        notesInput.type = 'text';
        notesInput.placeholder = 'Any additional details?'

        // input for a task checklist
        const renderChecklist = (function () {
            const label = document.createElement('label');
            label.for = 'checklist';
            label.innerHTML = 'Checklist:';
            const listDiv = document.createElement('div');
            listDiv.id = 'checklist-div'
            const listUl = document.createElement('ul');
            listUl.id = 'checklist-list';
            let textInput = document.createElement('input');
            textInput.type = 'text';
            textInput.id = 'checklist-text-input'
            const buttonDiv = document.createElement('div');
            const addItem = document.createElement('button');
            addItem.type = 'button';
            addItem.innerHTML = 'add';
            const removeItem = document.createElement('button');
            removeItem.type = 'button';
            removeItem.innerHTML = 'remove';
            addItem.addEventListener('click', function(e){
                e.preventDefault();
                if (textInput.value.length > 0){
                    let listItem = document.createElement('li');
                    listItem.classList.add('checklist-item');
                    listItem.innerHTML = '- ' + textInput.value;
                    listUl.appendChild(listItem);
                    textInput.value = '';
                };
            });
            removeItem.addEventListener('click', function(e){
                e.preventDefault();
                if (listUl.childElementCount > 0) {
                    listUl.removeChild(listUl.lastElementChild);
                }
            })

            buttonDiv.appendChild(addItem);
            buttonDiv.appendChild(removeItem);

            listDiv.appendChild(listUl);
            listDiv.appendChild(textInput);
            listDiv.appendChild(buttonDiv);
            return {
                label,
                listDiv
            }
            
        })();
    
        // button to submit the details and invoke function to make a new task object

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.innerHTML = 'Create';
        submitButton.addEventListener('click', addNewTask);

                
        // appending all elements to the DOM
        const taskCreationMenu = () => {
            newFormWindow('Task');
            let form = document.getElementById('task-form');
            newTextInput(form, "title", "Title:", "What needs doing?");
            newTextInput(form, "description", "Description:", "What are the details?");
            
            const appendArray = [
                dueDateLabel, dueDateInput, priorityLabel, priorityInput, notesLabel, notesInput,
                renderChecklist.label, renderChecklist.listDiv, submitButton
            ];
            for (let item of appendArray) {
                form.appendChild(item);
            };
            
        }

        function addNewTask(e) {
            e.preventDefault();
            console.log('hello');
            let inputs = [
            ];        
            let listItems = document.getElementsByClassName('checklist-item');
            let checklistObj = {};
            for (let item of listItems) {
                checklistObj[item.innerHTML.slice(2,item.innerHTML.length)] = false;
            };
            let newTask = new Task(...inputs, checklistObj);
            newTask.summary();

            return newTask;
        }


        return {
            taskCreationMenu
        }

        


    }
    
    dataInputWindow().taskCreationMenu();
}

export {
    pageLoad
}