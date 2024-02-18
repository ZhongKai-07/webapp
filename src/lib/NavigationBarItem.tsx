import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

interface NavigationBarItemProps {
  pathname: string;
  title: string;
}
const NavigationBarItem: React.FC<NavigationBarItemProps> = ({
  pathname,
  title,
}) => {
  const currentPathname = usePathname();
  const [hovered, setHovered] = useState(false);

  return (
    <li>
      <Link
        onMouseLeave={() => {
          setHovered(false);
        }}
        onMouseEnter={() => {
          setHovered(true);
        }}
        style={{}}
        href={pathname}
      >
        {title}
      </Link>
      <div
        className={`relative -mb-px h-px bg-black ${
          currentPathname == pathname || hovered ? 'w-full' : 'w-0'
        }`}
        style={{
          transition: 'width 300ms ease',
        }}
      ></div>
    </li>
  );
};
export default NavigationBarItem;
