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
import { ShieldCheck } from 'lucide-react';

export const navigation = [
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
