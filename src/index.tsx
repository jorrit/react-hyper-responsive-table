import { CSSProperties, TableHTMLAttributes, useState, useSyncExternalStore } from 'react';
import PropTypes from 'prop-types';

const stringOrElement = PropTypes.oneOfType([PropTypes.string, PropTypes.element]);
const objectOfStringOrElement = PropTypes.objectOf(stringOrElement);

const getClassNameOrStyleProps = (
  classNameOrStyle: undefined | TableStylingValue,
  narrow: boolean
): TableHTMLAttributes<HTMLTableElement> => {
  if (!classNameOrStyle) {
    return {};
  }
  if (typeof classNameOrStyle === 'function') {
    classNameOrStyle = classNameOrStyle({ narrow });
  }
  if (typeof classNameOrStyle === 'string') {
    return { className: classNameOrStyle };
  }
  if (typeof classNameOrStyle === 'object') {
    return { style: classNameOrStyle };
  }
  return {};
};

function headerClass(withClasses, key) {
  return withClasses ? { className: `header-${key}` } : {};
}

function rowClass(withClasses, key) {
  return withClasses ? { className: `row-${key}` } : {};
}

const inBrowser = typeof window !== 'undefined';
const matchMedia = inBrowser && window.matchMedia !== null;

type TableStylingValue = string | CSSProperties | ((settings: { narrow: boolean }) => string);

interface HyperResponsiveTableProps<TRecord> {
  headers: TRecord;
  rows: TRecord[];
  breakpoint: string | number;
  keyGetter: (row: TRecord) => string;
  tableStyling?: TableStylingValue;
  initialNarrow?: boolean;
  withClasses?: boolean;
}

interface HyperResponsiveTableState {
  mql?: MediaQueryList;
  subscriber: (onStoreChange: () => void) => () => void;
}

const initialState: HyperResponsiveTableState = { subscriber: () => () => ({}) };

const HyperResponsiveTable = <TRecord,>({
  headers,
  rows,
  breakpoint,
  keyGetter,
  tableStyling,
  initialNarrow,
  withClasses,
}: HyperResponsiveTableProps<TRecord>) => {
  const [state, setState] = useState<HyperResponsiveTableState>(initialState);
  const [oldBreakpoint, setOldBreakpoint] = useState<string | number>();

  if (oldBreakpoint !== breakpoint && matchMedia) {
    const mql = window.matchMedia(typeof breakpoint === 'string' ? breakpoint : `(min-width: ${breakpoint}px)`);
    setState({
      mql,
      subscriber: onStoreChange => {
        if (matchMedia) {
          mql.addListener(onStoreChange);
          return () => mql.removeListener(onStoreChange);
        }

        return () => ({});
      },
    });
    setOldBreakpoint(breakpoint);
  }

  const narrow = useSyncExternalStore(
    state.subscriber,
    () => (state.mql ? !state.mql.matches : false), // on client
    () => initialNarrow // on server
  );

  const dataKeys = Object.keys(headers);

  if (narrow) {
    return (
      <table {...getClassNameOrStyleProps(tableStyling, narrow)}>
        {rows.map(row => (
          <tbody key={keyGetter(row)}>
            {dataKeys.map(key => (
              <tr key={key} {...rowClass(withClasses, keyGetter(row))}>
                <th {...headerClass(withClasses, key)} scope="row">
                  {headers[key]}
                </th>
                <td>{row[key]}</td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    );
  }

  return (
    <table {...getClassNameOrStyleProps(tableStyling, narrow)}>
      <thead>
        <tr>
          {dataKeys.map(key => (
            <th key={key} {...headerClass(withClasses, key)} scope="col">
              {headers[key]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map(row => (
          <tr key={keyGetter(row)} {...rowClass(withClasses, keyGetter(row))}>
            {dataKeys.map(key => (
              <td key={key}>{row[key]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

HyperResponsiveTable.propTypes = {
  headers: objectOfStringOrElement.isRequired,
  rows: PropTypes.arrayOf(objectOfStringOrElement).isRequired,
  breakpoint: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  keyGetter: PropTypes.func.isRequired,
  tableStyling: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.func]),
  initialNarrow: PropTypes.bool,
  withClasses: PropTypes.bool,
};

HyperResponsiveTable.defaultProps = {
  initialNarrow: false,
  withClasses: false,
  tableStyling: null,
};

export default HyperResponsiveTable;
