import React from 'react';
import { render } from 'react-testing-library';
import 'react-testing-library/cleanup-after-each';
import snapshotDiff from 'snapshot-diff';

import TeX from './index';

const _ = String.raw;

describe('TeX', () => {
  test('expression via props.children', () => {
    expect(render(<TeX>\sum_0^\infty</TeX>).container).toMatchSnapshot();
  });

  test('expression via props.math', () => {
    expect(render(<TeX math={_`\sum_0^\infty`} />)).toMatchSnapshot();
  });

  test('props updated', () => {
    const $ = render(<TeX>\sum_0^\infty</TeX>);
    const $first = $.container.cloneNode(true);
    let $second;

    $.rerender(<TeX>\sum_1^\infty</TeX>);
    $second = $.container.cloneNode(true);

    expect(snapshotDiff($first, $second)).toMatchSnapshot();
  });

  describe('error handling', () => {
    test('show error when it updates from invalid to valid formula', () => {
      const renderError = error => (
        <p>{error.message} Cannot render this formula.</p>
      );
      const $ = render(<TeX renderError={renderError}>\inta</TeX>);
      expect($.queryByText(/Cannot render this formula/)).not.toBeNull();

      $.rerender(<TeX renderError={renderError}>\sum_1^\infty</TeX>);
      expect($.queryByText(/Cannot render this formula/)).toBeNull();
    });

    test('show error when it updates from invalid to valid formula', () => {
      const renderError = error => (
        <p>{error.message} Cannot render this formula.</p>
      );
      const $ = render(<TeX renderError={renderError}>\sum_1^\infty</TeX>);
      expect($.queryByText(/Cannot render this formula/)).toBeNull();

      $.rerender(<TeX renderError={renderError}>\inta</TeX>);
      expect($.queryByText(/Cannot render this formula/)).not.toBeNull();
    });

    test('formula with the wrong part highlighted in default color', () => {
      const $ = render(<TeX>\inta</TeX>);
      expect($.container).toMatchSnapshot();
    });

    test('props.errorColor', () => {
      const $ = render(<TeX errorColor="#bb0000">\inta</TeX>);
      expect($.container).toMatchSnapshot();
    });

    test('invalid type of expression in props.math', () => {
      let $;
      global.console.error = jest.fn();
      $ = render(<TeX math={123} />);
      expect(
        $.queryByText(/KaTeX can only parse string typed expression/)
      ).not.toBeNull();
    });

    test('error is caused while parsing math expression', () => {
      let $;
      $ = render(<TeX math={_`\sum_{`} />);
      expect($.container).toMatchSnapshot();
    });

    test('props.renderError: invalid type of expression in props.math', () => {
      const renderError = error => <div>Message of error: {error.message}</div>;
      let $;
      $ = render(<TeX math={123} renderError={renderError} />);
      expect($.container).toMatchSnapshot();
    });

    test('props.renderError: error is caused while parsing math expression', () => {
      const renderError = error => <div>Message of error: {error.message}</div>;
      let $;
      $ = render(<TeX math={_`\sum_{`} renderError={renderError} />);
      expect($.container).toMatchSnapshot();
    });
  });
});
