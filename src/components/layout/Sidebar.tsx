import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import {
  HomeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  BuildingOffice2Icon,
  UsersIcon,
  Cog6ToothIcon,
  DocumentChartBarIcon,
  WalletIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager', 'sales_rep'] },
    { name: 'Leads', href: '/leads', icon: UserGroupIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager', 'sales_rep'] },
    { name: 'Tasks', href: '/tasks', icon: CurrencyDollarIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager', 'sales_rep'] },
    { name: 'Food Outlets', href: '/outlets', icon: BuildingOffice2Icon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager', 'sales_rep'] },
    { name: 'Activities', href: '/activities', icon: CalendarDaysIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager', 'sales_rep'] },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager', 'sales_rep'] },
    { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager'] },
    { name: 'Users', href: '/users', icon: UsersIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager'] },
    { name: 'RBAC', href: '/rbac', icon: UsersIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager'] },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, access: ['SUPER_ADMIN_ACCESS', 'admin', 'sales_manager', 'sales_rep'] },
  ];

  const filteredNavigation = navigation.filter(item =>
    user?.permissions?.some(permission => item.access.includes(permission))
  );

  return (
    <div
      className={clsx(
        'fixed left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800',
        'h-screen', // Full viewport height
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        'flex flex-col'
      )}
    >
      {/* Top Section: Logo */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="ml-3 text-lg font-bold text-neutral-900 dark:text-white">
            SalesPro
          </span>
        </div>
      </div>

      {/* Navigation: Takes remaining space, no internal scroll */}
      <nav className="flex-1 px-2 py-4 space-y-2 overflow-hidden">
        {filteredNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={closeSidebar}
              className={clsx(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500'
                  : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white'
              )}
            >
              <Icon
                className={clsx(
                  'mr-3 h-5 w-5 transition-colors',
                  isActive
                    ? 'text-primary-600 dark:text-primary-400'
                    : 'text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-300'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;