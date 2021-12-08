import { Task, Project } from './todo.js';
import { format } from 'date-fns';

function pageLoad(){

    const content = document.getElementById('content');


    // create the popup for adding new tasks

    const taskCreationWindow = function() {


        //div to hold the data form

        const container = document.createElement('div');
        container.id = 'form-container';



        //form to hold the items

        const form = document.createElement('form');
        form.name = 'task creation form';
        form.id = 'task-form';



        // input for the task name

        const titleLabel = document.createElement('label');
        titleLabel.for = 'title';
        titleLabel.innerHTML = 'Task:';
        const titleInput = document.createElement('input');
        titleInput.id = 'title';
        titleInput.type = 'text';
        titleInput.placeholder = 'What needs doing?';     
        

        
        // input for the task description

        const descriptionLabel = document.createElement('label');
        descriptionLabel.for = 'description';
        descriptionLabel.innerHTML = 'Description:';
        const descriptionInput = document.createElement('input');
        descriptionInput.id = 'description';
        descriptionInput.type = 'text';
        descriptionInput.placeholder = 'What are some details?'



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

        const checklistLabel = document.createElement('label');
        checklistLabel.for = 'checklist';
        checklistLabel.innerHTML = 'Checklist:';
        const checklistDiv = document.createElement('div');
        checklistDiv.id = 'checklist-div';
        let checklistTextInput = document.createElement('input');
        checklistTextInput.type = 'text';
        checklistTextInput.id = 'checklist-text-input'
        const addChecklistItem = document.createElement('button');
        addChecklistItem.type = 'button';
        addChecklistItem.innerHTML = 'add';
        addChecklistItem.addEventListener('click', function(){
            let checklistInput = document.createElement('input');
            checklistInput.type = 'checkbox';
            checklistDiv.insertBefore(checklistInput, checklistTextInput);            
        });

        checklistDiv.appendChild(checklistTextInput);
        checklistDiv.appendChild(addChecklistItem);
        

    
        // button to submit the details and invoke function to make a new task object

        const submitButton = document.createElement('button');
        submitButton.type = 'button';
        submitButton.innerHTML = 'Create';

        
        
        // appending all elements to the DOM

        const appendArray = [titleLabel, titleInput, descriptionLabel, descriptionInput,
            dueDateLabel, dueDateInput, priorityLabel, priorityInput, notesLabel, notesInput, checklistLabel,
            checklistDiv, submitButton
        ];
        for (let item of appendArray) {
            form.appendChild(item);
        };
        container.appendChild(form);
        content.appendChild(container);
    }
    
    taskCreationWindow();
}

export {
    pageLoad
}