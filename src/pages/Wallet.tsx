import React, { useState, useEffect } from 'react';
import api, { walletApi } from '../lib/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/users';

interface WalletData {
  id: number;
  userId: number;
  balance: number;
  totalEarned: number;
  lastPayoutDate: string | null;
  createdAt: string;
  updatedAt: string;
  userName?: string;
  email?: string;
}

interface Transaction {
  id: number;
  user_id: number;
  task_id: number | null;
  amount: number;
  type: string;
  description: string;
  created_at: string;
  task_name?: string;
}

const Wallet: React.FC = () => {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [allWallets, setAllWallets] = useState<WalletData[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const { user } = useAuth() as { user: User | null }; 

  useEffect(() => {
    // Check admin status from user permissions
    const isAdminUser = user?.permissions?.includes("SUPER_ADMIN_ACCESS") || user?.permissions?.includes("ADMIN_ACCESS") || false;
    setIsAdmin(isAdminUser);

    // Fetch data based on role
    if (isAdminUser) {
      fetchAllWallets();
    } else {
      fetchUserData();
    }
  }, [user]);

  useEffect(() => {
    if (!isAdmin) {
      fetchTransactions();
    }
  }, [currentPage, isAdmin]);

  const fetchUserData = async () => {
    try {
      const response = await walletApi.getWallet();
      setWallet(response.data);
    } catch (err) {
      setError('Failed to fetch wallet data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllWallets = async () => {
    try {
      const response = await api.get('wallet/admin/all');
      setAllWallets(response.data.data);
    } catch (err) {
      setError('Failed to fetch wallets data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const offset = (currentPage - 1) * itemsPerPage;
      const response = await walletApi.getTransactions(itemsPerPage, offset);
      setTransactions(response.data.transactions || response.data);

      if (response.data.total) {
        setTotalPages(Math.ceil(response.data.total / itemsPerPage));
      } else {
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      }
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error(err);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isAdmin ? 'All Wallets (Admin)' : 'My Wallet'}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300">
          {isAdmin ? 'View and manage all user wallets' : 'Manage your earnings and view transaction history'}
        </p>
      </div>

      {isAdmin ? (
        <Card className="bg-white dark:bg-gray-800">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">All User Wallets</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Total Earned
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Last Payout
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allWallets.map((wallet) => (
                    <tr key={wallet.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {wallet.userName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {wallet.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600 dark:text-green-400">
                        {formatCurrency(wallet.balance)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                        {formatCurrency(wallet.totalEarned)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                        {wallet.lastPayoutDate
                          ? new Date(wallet.lastPayoutDate).toLocaleDateString()
                          : 'No payouts yet'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white dark:from-blue-600 dark:to-blue-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Current Balance</h3>
                <p className="text-3xl font-bold">{formatCurrency(wallet?.balance ?? 0)}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white dark:from-green-600 dark:to-green-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Total Earned</h3>
                <p className="text-3xl font-bold">{formatCurrency(wallet?.totalEarned ?? 0)}</p>
              </div>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white dark:from-purple-600 dark:to-purple-700">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-2">Last Payout</h3>
                <p className="text-xl">
                  {wallet?.lastPayoutDate
                    ? new Date(wallet.lastPayoutDate).toLocaleDateString()
                    : 'No payouts yet'}
                </p>
              </div>
            </Card>
          </div>

          <Card className="bg-white dark:bg-gray-800">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Transaction History</h2>

              {transactions.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No transactions yet</p>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Task
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {transactions.map((transaction) => (
                          <tr key={transaction.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {transaction.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                              {transaction.task_name ?? 'N/A'}
                            </td>
                            <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                              transaction.type === 'credit'
                                ? 'text-green-600 dark:text-green-400'
                                : 'text-red-600 dark:text-red-400'
                            }`}>
                              {formatCurrency(transaction.amount)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          variant="outline"
                          size="sm"
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                          variant="outline"
                          size="sm"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default Wallet;