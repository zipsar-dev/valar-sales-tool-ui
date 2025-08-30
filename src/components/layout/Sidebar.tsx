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
} from '@heroicons/react/24/solid';
import { useAuth } from '../../contexts/AuthContext';
import { ShieldCheck } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  closeSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, closeSidebar }) => {
  const location = useLocation();
  const { user } = useAuth();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER', 'SALES_REP'] },
    { name: 'Leads', href: '/leads', icon: UserGroupIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER', 'SALES_REP'] },
    { name: 'Tasks', href: '/tasks', icon: CurrencyDollarIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER', 'SALES_REP'] },
    { name: 'Food Outlets', href: '/outlets', icon: BuildingOffice2Icon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER', 'SALES_REP'] },
    { name: 'Activities', href: '/activities', icon: CalendarDaysIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER', 'SALES_REP'] },
    { name: 'Wallet', href: '/wallet', icon: WalletIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER', 'SALES_REP'] },
    { name: 'Reports', href: '/reports', icon: DocumentChartBarIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER'] },
    { name: 'Users', href: '/users', icon: UsersIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER'] },
    { name: 'RBAC', href: '/rbac', icon: ShieldCheck, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER'] },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon, access: ['SUPER_ADMIN_ACCESS', 'ADMIN_ACCESS', 'SALES_MANAGER', 'SALES_REP'] },
  ];

  const filteredNavigation = navigation.filter(item =>
    user?.permissions?.some(permission => item.access.includes(permission))
  );

  return (
    <div
      className={clsx(
        'fixed left-0 z-50 w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800',
        'h-screen',
        isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
        'flex flex-col'
      )}
    >
      {/* Top Section: Logo */}
      <div className="flex items-center h-16 px-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-lg">V</span>
          </div>
          <span className="ml-3 text-lg font-bold text-neutral-900 dark:text-white">
            Valar
          </span>
        </div>
      </div>

      {/* Navigation */}
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
              <div
                className={clsx(
                  'mr-3 h-6 w-6 p-1 rounded-md flex items-center justify-center transition-all duration-200 group-hover:scale-110',
                  isActive
                    ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 group-hover:bg-gradient-to-br group-hover:from-primary-400 group-hover:to-primary-500 group-hover:text-white'
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;