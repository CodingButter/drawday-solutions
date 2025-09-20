'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@raffle-spinner/ui';
import { Star, Quote } from 'lucide-react';

interface Review {
  id: string;
  name: string;
  company?: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, averageRating: 0 });

  useEffect(() => {
    fetch('/api/reviews?approved=true&limit=6')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReviews(data.reviews);
          setStats(data.stats);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center">
            <p className="text-muted-foreground">Loading reviews...</p>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null; // Don't show section if no reviews yet
  }

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-white to-purple-50 dark:from-gray-900 dark:to-purple-900/10">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 ${
                    star <= Math.round(stats.averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold">{stats.averageRating}</span>
            <span className="text-muted-foreground">({stats.total} reviews)</span>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <Card key={review.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-2 mb-3">
                  <Quote className="h-6 w-6 text-purple-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <h3 className="font-semibold mb-2">{review.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {review.comment}
                    </p>
                    <div className="text-sm">
                      <p className="font-medium">{review.name}</p>
                      {review.company && (
                        <p className="text-muted-foreground">{review.company}</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-8">
          <a
            href="/reviews"
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300 font-medium"
          >
            Write a Review
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}