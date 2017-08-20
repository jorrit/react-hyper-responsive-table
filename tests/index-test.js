import expect from 'expect';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

import Component from '../src/';

describe('Component', () => {
  let node;

  beforeEach(() => {
    node = document.createElement('div');
  });

  afterEach(() => {
    unmountComponentAtNode(node);
  });

  it('wide', () => {
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
    const breakpoint = 300;
    const props = { headers, rows, keyGetter, breakpoint };

    render(<Component {...props} />, node, () => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(3);
      expect(node.querySelectorAll('thead').length).toEqual(1);
      expect(node.querySelectorAll('tbody').length).toEqual(1);
    });
  });

  it('narrow', () => {
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
    const breakpoint = 3000;
    const props = { headers, rows, keyGetter, breakpoint };

    render(<Component {...props} />, node, () => {
      expect(node.querySelectorAll('table').length).toEqual(1);
      expect(node.querySelectorAll('tr').length).toEqual(4);
      expect(node.querySelectorAll('thead').length).toEqual(0);
      expect(node.querySelectorAll('tbody').length).toEqual(2);
    });
  });
});
