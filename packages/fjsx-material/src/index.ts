import '../init-fjsx';

import { App } from './App';
import './JSX.d.ts';

const mainDiv = document.getElementById('main');
const app = App();
mainDiv.appendChild(app);
