import { intervalToDuration } from 'date-fns';
import './reset.css';
import './style.css';
import './mixkit-starry-night-sky-over-hills-and-water-85-original.png'
import {taskCreationMenu} from './pageControl.js';




const newTaskButton = document.getElementById('new-task-button');
newTaskButton.addEventListener('click', () => {
    let checkForm = Array.from(document.getElementById('content').childNodes)
    .find((node) => node.id == 'form-overlay');
    if (!checkForm) { taskCreationMenu(); }
    
});