import Book from '../models/Book.js';
import Borrowing from '../models/Borrowing.js';

class RecommendationEngine {
  static async getUserRecommendations(userId) {
    try {
      // Get user's borrowing history
      const userBorrowings = await Borrowing.find({ user: userId })
        .populate('book')
        .sort('-borrowDate')
        .limit(10);

      // Extract user preferences
      const preferences = this.extractPreferences(userBorrowings);

      // Get recommendations based on preferences
      const recommendations = await this.getRecommendedBooks(preferences, userId);

      return recommendations;
    } catch (error) {
      console.error('Recommendation engine error:', error);
      return [];
    }
  }

  static extractPreferences(borrowings) {
    const preferences = {
      categories: new Map(),
      authors: new Map(),
      keywords: new Map()
    };

    borrowings.forEach(borrowing => {
      const book = borrowing.book;
      if (!book) return;

      // Count category preferences
      this.incrementMapCount(preferences.categories, book.category);

      // Count author preferences
      this.incrementMapCount(preferences.authors, book.author);

      // Extract and count keywords from title and description
      const keywords = this.extractKeywords(book.title + ' ' + book.description);
      keywords.forEach(keyword => {
        this.incrementMapCount(preferences.keywords, keyword);
      });
    });

    return preferences;
  }

  static incrementMapCount(map, key) {
    map.set(key, (map.get(key) || 0) + 1);
  }

  static extractKeywords(text) {
    // Simple keyword extraction (can be enhanced with NLP libraries)
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);
  }

  static async getRecommendedBooks(preferences, userId) {
    // Convert preferences to arrays sorted by count
    const topCategories = Array.from(preferences.categories.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([category]) => category);

    const topAuthors = Array.from(preferences.authors.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([author]) => author);

    // Get recommendations based on user preferences
    const recommendations = await Book.aggregate([
      {
        $match: {
          $or: [
            { category: { $in: topCategories.slice(0, 3) } },
            { author: { $in: topAuthors.slice(0, 3) } }
          ],
          availableCopies: { $gt: 0 }
        }
      },
      {
        $addFields: {
          score: {
            $add: [
              {
                $cond: [
                  { $in: ['$category', topCategories.slice(0, 3)] },
                  3,
                  0
                ]
              },
              {
                $cond: [
                  { $in: ['$author', topAuthors.slice(0, 3)] },
                  2,
                  0
                ]
              },
              { $multiply: ['$averageRating', 0.5] },
              { $multiply: [{ $divide: ['$borrowCount', 100] }, 0.3] }
            ]
          }
        }
      },
      {
        $sort: { score: -1 }
      },
      {
        $limit: 10
      }
    ]);

    return recommendations;
  }
}

export default RecommendationEngine;