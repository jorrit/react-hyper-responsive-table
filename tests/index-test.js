import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import matchMediaMock from 'match-media-mock';

import Component from '../src';

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

  beforeEach(() => {
    matchMedia.setConfig({ type: 'screen', width: 1200 });
    node = document.createElement('div');
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it('low integer breakpoint should give wide styled table', () => {
    const breakpoint = 300;
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
    };

    render(<Component {...props} />, node, () => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(3);
      expect(node.querySelectorAll('thead').length).toEqual(1);
      expect(node.querySelectorAll('tbody').length).toEqual(1);
    });
  });

  it('high integer breakpoint should give narrow styled table', () => {
    const breakpoint = 3000;
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
    };

    render(<Component {...props} />, node, () => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(4);
      expect(node.querySelectorAll('thead').length).toEqual(0);
      expect(node.querySelectorAll('tbody').length).toEqual(2);
    });
  });

  it('low media query breakpoint should give wide styled table', () => {
    const breakpoint = 'screen and (min-width: 1000px)';
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
    };

    render(<Component {...props} />, node, () => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(3);
      expect(node.querySelectorAll('thead').length).toEqual(1);
      expect(node.querySelectorAll('tbody').length).toEqual(1);
    });
  });

  it('tableStyling function value should give dynamic class when string is returned', () => {
    const tableStyling = opts => (opts.narrow ? 'narrow' : 'wide');
    const props = {
      headers,
      rows,
      keyGetter,
      tableStyling,
    };

    render(<Component {...props} breakpoint={3000} />, node, () => {
      expect(node.querySelectorAll('table.narrow').length).toEqual(1);
      expect(node.querySelectorAll('table.wide').length).toEqual(0);
      expect(node.querySelector('table').getAttribute('style')).toEqual(null);
    });

    render(<Component {...props} breakpoint={300} />, node, () => {
      expect(node.querySelectorAll('table.narrow').length).toEqual(0);
      expect(node.querySelectorAll('table.wide').length).toEqual(1);
      expect(node.querySelector('table').getAttribute('style')).toEqual(null);
    });
  });

  it('tableStyling object value should give style attribute', () => {
    const breakpoint = 3000;
    const tableStyling = { color: 'red' };
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    render(<Component {...props} />, node, () => {
      const table = node.querySelector('table');
      expect(table.getAttribute('style')).toEqual('color: red;');
      expect(table.getAttribute('class')).toEqual(null);
    });
  });

  it('wide to narrow change should trigger tableStyling function call', (done) => {
    const breakpoint = 1000;
    const tableStyling = opts => (opts.narrow ? 'narrow' : 'wide');
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    render(<Component {...props} />, node, () => {
      const table = node.querySelector('table');
      expect(table.getAttribute('class')).toEqual('wide');

      matchMedia.setConfig({ type: 'screen', width: 900 });

      // Wait a bit before React notices the screen size update.
      setTimeout(() => {
        expect(table.getAttribute('class')).toEqual('narrow');
        done();
      }, 50);
    });
  });

  it('invalid tableStyling should give no class or style attribute', () => {
    const breakpoint = 1000;
    const tableStyling = 1234;
    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
    };

    render(<Component {...props} />, node, () => {
      const table = node.querySelector('table');
      expect(table.getAttribute('class')).toEqual(null);
      expect(table.getAttribute('style')).toEqual(null);
    });
  });

  it('add classes to headers and rows if pass the property `withClasses`', () => {
    const breakpoint = 0;
    const tableStyling = 1234;
    const withClasses = true;

    const props = {
      headers,
      rows,
      keyGetter,
      breakpoint,
      tableStyling,
      withClasses,
    };

    render(<Component {...props} />, node, () => {
      const th = node.querySelectorAll('th');
      const tbody = node.querySelectorAll('tbody');
      const tr = tbody[0].querySelectorAll('tr');

      expect(th[0].getAttribute('class')).toEqual('header-a');
      expect(tr[0].getAttribute('class')).toEqual('row-A 1');
    });
  });
});
