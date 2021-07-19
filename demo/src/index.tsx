import { render } from 'react-dom';

import './demo.css';
import ReactHyperResponsiveTable from '../../src';

const headers = {
  image: '',
  name: 'Name',
  role: 'Role',
};

const rows = [
  {
    name: 'Marlon Brando',
    role: <a href="https://en.wikipedia.org/wiki/Vito_Corleone">Vito Corleone</a>,
    image: <img src="https://upload.wikimedia.org/wikipedia/en/2/21/Godfather15_flip.jpg" alt="Vito Corleone" />,
  },
  {
    image: <img src="https://upload.wikimedia.org/wikipedia/en/d/df/Michaelcoreleone.jpg" alt="Al Pacino" />,
    name: 'Al Pacino',
    role: <a href="https://en.wikipedia.org/wiki/Michael_Corleone">Michael Corleone</a>,
  },
  {
    image: <img src="https://upload.wikimedia.org/wikipedia/en/9/9d/Santino_corleone_2.jpg" alt="Santino Corleone" />,
    name: 'James Caan',
    role: <a href="https://en.wikipedia.org/wiki/Santino_Corleone">Santino Corleone</a>,
  },
  {
    image: <img src="https://upload.wikimedia.org/wikipedia/en/6/67/Tom_Hagen.jpg" alt="Tom Hagen" />,
    name: 'Robert Duvall',
    role: <a href="https://en.wikipedia.org/wiki/Tom_Hagen">Tom Hagen</a>,
  },
  {
    image: <img src="https://upload.wikimedia.org/wikipedia/en/e/e7/FredoCorleone.jpg" alt="Fredo Corleone" />,
    name: 'John Cazale',
    role: <a href="https://en.wikipedia.org/wiki/Fredo_Corleone">Fredo Corleone</a>,
  },
  {
    image: <img src="https://upload.wikimedia.org/wikipedia/tr/9/9c/Godf3Connie2.jpg" alt="Connie Corleone" />,
    name: 'Talia Shire',
    role: <a href="https://en.wikipedia.org/wiki/Connie_Corleone">Connie Corleone</a>,
  },
];
const keyGetter = row => row.name;

const Demo = () => (
  <div>
    <h1>react-hyper-responsive-table demo</h1>
    <p>The breakpoint of this demo is set to 578 pixels.</p>
    <ReactHyperResponsiveTable
      headers={headers}
      rows={rows}
      keyGetter={keyGetter}
      breakpoint={578}
      withClasses
      tableStyling={({ narrow }) => (narrow ? 'narrowtable' : 'widetable')}
    />
  </div>
);

render(<Demo />, document.querySelector('body'));
