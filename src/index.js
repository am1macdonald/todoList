import { intervalToDuration } from 'date-fns';
import './reset.css';
import './style.css';
import image from './mixkit-starry-night-sky-over-hills-and-water-85-original.png'
import {renderStaticElements, taskCreationMenu} from './pageControl.js';


renderStaticElements();


const newTaskButton = document.getElementById('new-task-button');
newTaskButton.addEventListener('click', () => {
    let checkForm = Array.from(document.getElementById('content').childNodes)
    .find((node) => node.id == 'form-overlay');
    if (!checkForm) { taskCreationMenu(); }
    
});