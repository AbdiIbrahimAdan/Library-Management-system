import Book from '../models/Book.js';
import User from '../models/User.js';
import Borrowing from '../models/Borrowing.js';

export const getAnalytics = async (req, res) => {
  try {
    const { timeRange = 'month' } = req.query;
    const dateRange = getDateRange(timeRange);

    // Fetch total counts
    const [totalBooks, activeUsers, totalBorrowings, returnedBorrowings] = await Promise.all([
      Book.countDocuments(),
      User.countDocuments({ lastActive: { $gte: dateRange } }),
      Borrowing.countDocuments({ borrowDate: { $gte: dateRange } }),
      Borrowing.countDocuments({
        borrowDate: { $gte: dateRange },
        status: 'Returned',
      }),
    ]);

    // Calculate return rate
    const returnRate = totalBorrowings
      ? Math.round((returnedBorrowings / totalBorrowings) * 100)
      : 0;

    // Category distribution
    const categoryDistribution = await Book.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $project: { name: '$_id', value: '$count', _id: 0 } },
    ]);

    // Borrowing trends
    const borrowingTrends = await getBorrowingTrends(dateRange);

    // Popular books with ratings
    const popularBooks = await Book.aggregate([
      { $sort: { borrowCount: -1 } },
      { $limit: 10 },
      {
        $project: {
          title: 1,
          borrowCount: 1,
          averageRating: 1, // Include average rating
          totalRatings: 1,  // Include total ratings
          _id: 0,
        },
      },
    ]);

    // User activity trends
    const userActivity = await getUserActivity(dateRange);

    // Gender, country, and age stats
    const [genderStats, countryStats, ageStats, totalUsers] = await Promise.all([
      User.aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }]),
      User.aggregate([{ $group: { _id: '$country', count: { $sum: 1 } } }]),
      User.aggregate([
        {
          $bucket: {
            groupBy: '$age',
            boundaries: [0, 18, 30, 40, 50, 60, 100],
            default: '60+',
            output: { count: { $sum: 1 } },
          },
        },
      ]),
      User.countDocuments(),
    ]);

    // Response
    res.status(200).json({
      totalBooks,
      activeUsers,
      totalBorrowings,
      returnRate,
      categoryDistribution,
      borrowingTrends,
      popularBooks,
      userActivity,
      totalUsers,
      genderStats,
      countryStats,
      ageStats,
    });
  } catch (error) {
    console.error(`Error fetching analytics: ${error.message}`);
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Helper: Calculate the date range based on the selected time period
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

// Helper: Get borrowing trends
const getBorrowingTrends = async (dateRange) => {
  return Borrowing.aggregate([
    { $match: { borrowDate: { $gte: dateRange } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$borrowDate' } },
        borrowings: { $sum: 1 },
        returns: { $sum: { $cond: [{ $eq: ['$status', 'Returned'] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', borrowings: 1, returns: 1, _id: 0 } },
  ]);
};

// Helper: Get user activity trends
const getUserActivity = async (dateRange) => {
  return User.aggregate([
    { $match: { lastActive: { $gte: dateRange } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$lastActive' } },
        activeUsers: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { date: '$_id', activeUsers: 1, _id: 0 } },
  ]);
};
