import { intervalToDuration } from 'date-fns';
import './reset.css';
import './style.css';
import {pageLoad} from './pageControl.js';
import './pageFunctions.js';
import { cacheDom } from './pageFunctions.js';

pageLoad();
cacheDom();


