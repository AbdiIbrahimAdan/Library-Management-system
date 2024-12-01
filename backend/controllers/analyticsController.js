import Book from '../models/Book.js';
import User from '../models/User.js';
import Borrowing from '../models/Borrowing.js';

export const getAnalytics = async (req, res) => {
  try {
    const { timeRange } = req.query;
    const dateRange = getDateRange(timeRange);

    // Get basic statistics
    const totalBooks = await Book.countDocuments();
    const activeUsers = await User.countDocuments({ lastActive: { $gte: dateRange } });
    const totalBorrowings = await Borrowing.countDocuments({ borrowDate: { $gte: dateRange } });
    
    // Calculate return rate
    const returnedBorrowings = await Borrowing.countDocuments({
      borrowDate: { $gte: dateRange },
      status: 'Returned'
    });
    const returnRate = Math.round((returnedBorrowings / totalBorrowings) * 100) || 0;

    // Get category distribution
    const categoryDistribution = await Book.aggregate([
      {
        $group: {
          _id: '$category',
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          name: '$_id',
          value: 1,
          _id: 0
        }
      }
    ]);

    // Get borrowing trends
    const borrowingTrends = await getBorrowingTrends(dateRange);

    // Get popular books
    const popularBooks = await Book.aggregate([
      {
        $sort: { borrowCount: -1 }
      },
      {
        $limit: 10
      },
      {
        $project: {
          title: 1,
          borrowCount: 1,
          _id: 0
        }
      }
    ]);

    // Get user activity
    const userActivity = await getUserActivity(dateRange);

    res.json({
      totalBooks,
      activeUsers,
      totalBorrowings,
      returnRate,
      categoryDistribution,
      borrowingTrends,
      popularBooks,
      userActivity
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

const getDateRange = (timeRange) => {
  const now = new Date();
  switch (timeRange) {
    case 'week':
      return new Date(now.setDate(now.getDate() - 7));
    case 'year':
      return new Date(now.setFullYear(now.getFullYear() - 1));
    case 'month':
    default:
      return new Date(now.setMonth(now.getMonth() - 1));
  }
};

const getBorrowingTrends = async (dateRange) => {
  // Aggregate daily borrowing and return counts
  const trends = await Borrowing.aggregate([
    {
      $match: {
        borrowDate: { $gte: dateRange }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$borrowDate' }
        },
        borrowings: { $sum: 1 },
        returns: {
          $sum: {
            $cond: [{ $eq: ['$status', 'Returned'] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        date: '$_id',
        borrowings: 1,
        returns: 1,
        _id: 0
      }
    },
    {
      $sort: { date: 1 }
    }
  ]);

  return trends;
};

const getUserActivity = async (dateRange) => {
  // Aggregate daily active user counts
  const activity = await User.aggregate([
    {
      $match: {
        lastActive: { $gte: dateRange }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$lastActive' }
        },
        activeUsers: { $sum: 1 }
      }
    },
    {
      $project: {
        date: '$_id',
        activeUsers: 1,
        _id: 0
      }
    },
    {
      $sort: { date: 1 }
    }
  ]);

  return activity;
};