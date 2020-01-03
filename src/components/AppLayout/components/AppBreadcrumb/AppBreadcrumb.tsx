import React from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb, Typography } from 'antd';

import { useBreadcrumbContextValue } from 'contexts/BreadcrumbContext';

const AppBreadcrumb = () => {
  const { breadcrumbLinks } = useBreadcrumbContextValue();
  return (
    <Breadcrumb>
      {breadcrumbLinks.map(({ label, path, restorableStates, subMenu }, idx) => (
        <Breadcrumb.Item
          key={idx}
          {...(subMenu && {
            overlay: subMenu,
          })}
          {...(!label.includes("@") && {
            style: { textTransform: 'capitalize' },
          })}
        >
          {path ? (
            <Link
              to={{
                pathname: path,
                state: restorableStates,
              }}
            >
              {label}
            </Link>
          ): (
            <Typography.Text strong>{label}</Typography.Text>
          )}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
}

export default AppBreadcrumb;
