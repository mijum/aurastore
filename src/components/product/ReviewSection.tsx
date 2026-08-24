import React, { useState } from 'react';
import { ProductReview } from '../../types';
import { RatingStars } from '../common/RatingStars';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, MessageSquarePlus, Star } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface ReviewSectionProps {
  productId: string;
  reviews: ProductReview[];
  rating: number;
  reviewCount: number;
}

export const ReviewSection: React.FC<ReviewSectionProps> = ({
  productId,
  reviews,
  rating,
  reviewCount,
}) => {
  const { currentUser, submitReview, addToast } = useStore();

  const [newRating, setNewRating] = useState<number>(5);
  const [newComment, setNewComment] = useState<string>('');
  const [userName, setUserName] = useState<string>(currentUser?.name || '');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Rating distribution breakdown
  const ratingCounts = React.useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      const rounded = Math.round(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (counts[rounded] !== undefined) counts[rounded]++;
    });
    return counts;
  }, [reviews]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) {
      addToast('Please write a review comment before submitting.', 'warning');
      return;
    }

    setIsSubmitting(true);
    submitReview(productId, newRating, newComment.trim(), userName.trim() || undefined);
    setNewComment('');
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-10">
      {/* Overview & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6 sm:p-8 bg-slate-50 rounded-3xl border border-slate-100">
        {/* Big Score */}
        <div className="flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-slate-200">
          <div className="text-5xl font-black text-slate-900 mb-2">
            {rating.toFixed(1)}
          </div>
          <RatingStars rating={rating} size={20} className="mb-2" />
          <p className="text-xs font-semibold text-slate-500">
            Based on {reviewCount} verified reviews
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="md:col-span-2 flex flex-col justify-center space-y-2.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
            const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs font-medium text-slate-600">
                <span className="w-12 flex items-center gap-1">
                  {stars} <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-slate-400 font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquarePlus className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-900">Write a Customer Review</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Overall Rating
            </label>
            <RatingStars
              rating={newRating}
              interactive
              size={24}
              onRatingChange={(r) => setNewRating(r)}
            />
          </div>

          {!currentUser && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                placeholder="e.g. Mahir Chowdhury"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Review Details
            </label>
            <textarea
              rows={4}
              placeholder="What did you like or dislike about this product? How is the fit and material?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-indigo-600/20 disabled:opacity-50"
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-900">
          Customer Feedback ({reviews.length})
        </h3>

        {reviews.length === 0 ? (
          <p className="text-sm text-slate-500 italic">
            No reviews yet for this product. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="divide-y divide-slate-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="py-5 first:pt-0">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {rev.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Verified Buyer
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(rev.date)}</span>
                </div>

                <RatingStars rating={rev.rating} size={14} className="mb-2" />
                <p className="text-sm text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
