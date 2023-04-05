/* eslint-env browser, mocha */

import expect from 'expect';
import { createRoot, Root } from 'react-dom/client';
import matchMediaMock from 'match-media-mock';

import Component from './index';

const matchMedia = matchMediaMock.create();
window.matchMedia = matchMedia;

const headers = {
  a: 'A',
  b: 'B',
};
const rows = [
  {
    a: 'A 1',
    b: 'B 1',
  },
  {
    a: 'A 2',
    b: 'B 2',
  },
];
const keyGetter = r => r.a;

describe('Component', () => {
  let node;
  let root: Root;

  beforeEach(() => {
    matchMedia.setConfig({ type: 'screen', width: 1200 });
    node = document.createElement('div');
    root = createRoot(node);
  });

  afterEach(() => {
    root.unmount();
  });

  it('low integer breakpoint should give wide styled table', done => {
    const breakpoint = 300;
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(3);
      expect(node.querySelectorAll('thead').length).toEqual(1);
      expect(node.querySelectorAll('tbody').length).toEqual(1);

      done();
    }, 50);
  });

  it('high integer breakpoint should give narrow styled table', done => {
    const breakpoint = 3000;
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(4);
      expect(node.querySelectorAll('thead').length).toEqual(0);
      expect(node.querySelectorAll('tbody').length).toEqual(2);

      done();
    }, 50);
  });

  it('low media query breakpoint should give wide styled table', done => {
    const breakpoint = 'screen and (min-width: 1000px)';
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(3);
      expect(node.querySelectorAll('thead').length).toEqual(1);
      expect(node.querySelectorAll('tbody').length).toEqual(1);

      done();
    }, 50);
  });

  it('tableStyling function value should give dynamic class when string is returned', done => {
    const tableStyling = opts => (opts.narrow ? 'narrow' : 'wide');
    const props = {
      headers,
      rows,
      keyGetter,
      tableStyling,
    };

    root.render(<Component {...props} breakpoint={3000} />);

    setTimeout(() => {
      expect(node.querySelectorAll('table.narrow').length).toEqual(1);
      expect(node.querySelectorAll('table.wide').length).toEqual(0);
      expect(node.querySelector('table').getAttribute('style')).toEqual(null);

      root.render(<Component {...props} breakpoint={300} />);

      setTimeout(() => {
        expect(node.querySelectorAll('table.narrow').length).toEqual(0);
        expect(node.querySelectorAll('table.wide').length).toEqual(1);
        expect(node.querySelector('table').getAttribute('style')).toEqual(null);

        done();
      }, 50);
    }, 50);
  });

  it('tableStyling object value should give style attribute', done => {
    const breakpoint = 3000;
    const tableStyling = { color: 'red' };
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      const table = node.querySelector('table');
      expect(table.getAttribute('style')).toEqual('color: red;');
      expect(table.getAttribute('class')).toEqual(null);

      done();
    }, 50);
  });

  it('wide to narrow change should trigger tableStyling function call', done => {
    const breakpoint = 1000;
    const tableStyling = opts => (opts.narrow ? 'narrow' : 'wide');
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      const table = node.querySelector('table');
      expect(table.getAttribute('class')).toEqual('wide');

      matchMedia.setConfig({ type: 'screen', width: 900 });

      // Wait a bit before React notices the screen size update.
      setTimeout(() => {
        expect(table.getAttribute('class')).toEqual('narrow');
        done();
      }, 50);
    }, 50);
  });

  it('invalid tableStyling should give no class or style attribute', done => {
    const breakpoint = 1000;
    const tableStyling = 1234;
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    root.render(<Component {...props} />);

    setTimeout(() => {
      const table = node.querySelector('table');
      expect(table.getAttribute('class')).toEqual(null);
      expect(table.getAttribute('style')).toEqual(null);

      done();
    }, 50);
  });

  it('add classes to headers and rows if pass the property `withClasses`', done => {
    const breakpoint = 0;
    const withClasses = true;

    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      withClasses,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      const th = node.querySelectorAll('th');
      const tbody = node.querySelectorAll('tbody');
      const tr = tbody[0].querySelectorAll('tr');

      expect(th[0].getAttribute('class')).toEqual('header-a');
      expect(tr[0].getAttribute('class')).toEqual('row-A 1');

      done();
    }, 50);
  });

  it('print wide', done => {
    const breakpoint = 1000;
    const tableStyling = opts => (opts.narrow ? 'narrow' : 'wide');
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      const table = node.querySelector('table');
      expect(table.getAttribute('class')).toEqual('wide');

      matchMedia.setConfig({ type: 'print', width: 1001 });

      // Wait a bit before React notices the screen size update.
      setTimeout(() => {
        expect(table.getAttribute('class')).toEqual('wide');
        done();
      }, 50);
    }, 50);
  });

  it('print narrow', done => {
    const breakpoint = 1000;
    const tableStyling = opts => (opts.narrow ? 'narrow' : 'wide');
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      const table = node.querySelector('table');
      expect(table.getAttribute('class')).toEqual('wide');

      matchMedia.setConfig({ type: 'print', width: 900 });

      // Wait a bit before React notices the screen size update.
      setTimeout(() => {
        expect(table.getAttribute('class')).toEqual('narrow');
        done();
      }, 50);
    }, 50);
  });

  it('change width without crossing breakpoint', done => {
    const breakpoint = 900;
    const tableStyling = opts => (opts.narrow ? 'narrow' : 'wide');
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    root.render(<Component {...props} />);

    setTimeout(() => {
      const table = node.querySelector('table');
      expect(table.getAttribute('class')).toEqual('wide');

      matchMedia.setConfig({ type: 'screen', width: 800 });
      matchMedia.setConfig({ type: 'screen', width: 700 });
      matchMedia.setConfig({ type: 'screen', width: 600 });

      // Wait a bit before React notices the screen size update.
      setTimeout(() => {
        expect(table.getAttribute('class')).toEqual('narrow');
        done();
      }, 50);
    }, 50);
  });
});
