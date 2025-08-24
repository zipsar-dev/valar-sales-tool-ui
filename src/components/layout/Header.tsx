import React, { useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { clsx } from 'clsx';
import Input from '../ui/Input';

// Custom hook for media query
const useMediaQuery = (query: string) => {
  const [matches, setMatches] = React.useState(false);

  React.useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);

    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query]);

  return matches;
};

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const isMobile = useMediaQuery('(max-width: 767px)'); // Matches Tailwind's md breakpoint

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <header
      className="h-16 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between p-4 md:p-6 lg:p-8 sticky top-0 z-40"
    >
      {/* Left side: Menu button (mobile only) */}
      {isMobile && (
        <div className="flex items-center space-x-2">
          <button
            onClick={toggleSidebar}
            className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Search */}
      <div className="flex-1 max-w-full sm:max-w-md">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search leads, opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            className="w-full text-sm"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
        >
          {theme === 'light' ? (
            <MoonIcon className="h-5 w-5" />
          ) : (
            <SunIcon className="h-5 w-5" />
          )}
        </button>

        {/* Notifications */}
        {/* <button className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors relative">
          <BellIcon className="h-5 w-5" />
          <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-error-500"></span>
        </button> */}

        {/* User menu */}
        <Menu as="div" className="relative">
          <Menu.Button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
            <div className="w-8 h-8 bg-gradient-to-br from-secondary-400 to-secondary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </span>
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </Menu.Button>

          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white dark:bg-neutral-800 shadow-strong ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/profile"
                      className={clsx(
                        'group flex items-center px-4 py-2 text-sm',
                        active
                          ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      <UserCircleIcon className="mr-3 h-5 w-5" />
                      Your Profile
                    </a>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <a
                      href="/settings"
                      className={clsx(
                        'group flex items-center px-4 py-2 text-sm',
                        active
                          ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      <Cog6ToothIcon className="mr-3 h-5 w-5" />
                      Settings
                    </a>
                  )}
                </Menu.Item>
                <div className="border-t border-neutral-200 dark:border-neutral-700"></div>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleLogout}
                      className={clsx(
                        'group flex w-full items-center px-4 py-2 text-sm',
                        active
                          ? 'bg-neutral-100 dark:bg-neutral-700 text-neutral-900 dark:text-white'
                          : 'text-neutral-700 dark:text-neutral-300'
                      )}
                    >
                      <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
                      Sign out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </header>
  );
};

export default Header;