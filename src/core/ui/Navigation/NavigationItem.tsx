'use client';

import Link from 'next/link';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import isRouteActive from '~/core/generic/is-route-active';

interface LinkModel {
  path: string;
  label: string;
}

const NavigationMenuItem: React.FCC<{
  link: LinkModel;
  disabled?: boolean;
  className?: string;
  prefetch?: React.ComponentProps<typeof Link>['prefetch'];
  depth?: number;
}> = ({ link, disabled, prefetch, className, depth = 2 }) => {
  const label = link.label;
  const pathName = usePathname() ?? '';
  const isActive = isRouteActive(link.path, pathName, depth);

  const itemClassName = classNames(`NavigationItem`, className, {
    [`NavigationItemActive`]: isActive,
    [`NavigationItemNotActive`]: !isActive,
  });

  if (disabled) {
    return <span className={itemClassName}>{label}</span>;
  }

  return (
    <Link prefetch={prefetch} className={itemClassName} href={link.path}>
      {label}
    </Link>
  );
};

export default NavigationMenuItem;
