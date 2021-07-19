import {
  CSSProperties,
  FunctionComponent,
  ReactNode,
  TableHTMLAttributes,
  useState,
  useSyncExternalStore,
} from 'react';
import * as PropTypes from 'prop-types';

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
    // eslint-disable-next-line no-param-reassign
    classNameOrStyle = classNameOrStyle.call(null, {
      narrow: narrow,
    });
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

type TableRecordType = Record<string, ReactNode>;

type TableStylingValue = string | CSSProperties | ((row: TableRecordType) => string);

interface HyperResponsiveTableProps {
  headers: TableRecordType;
  rows: TableRecordType[];
  breakpoint: string | number;
  keyGetter: (row: TableRecordType) => string;
  tableStyling?: TableStylingValue;
  initialNarrow?: boolean;
  withClasses?: boolean;
}

const HyperResponsiveTable: FunctionComponent<HyperResponsiveTableProps> = ({
  headers,
  rows,
  breakpoint,
  keyGetter,
  tableStyling,
  initialNarrow,
  withClasses,
}) => {
  const [mql, setMql] = useState<MediaQueryList>();
  const [oldBreakpoint, setOldBreakpoint] = useState<string | number>();
  if (oldBreakpoint !== breakpoint && matchMedia) {
    setMql(window.matchMedia(typeof breakpoint === 'string' ? breakpoint : `(min-width: ${breakpoint}px)`));
    setOldBreakpoint(breakpoint);
  }

  const narrow = useSyncExternalStore(
    onStoreChange => {
      if (matchMedia) {
        mql.addListener(onStoreChange);
        return () => mql.removeListener(onStoreChange);
      }

      return () => ({});
    },
    () => (mql ? !mql.matches : false), // on client
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
