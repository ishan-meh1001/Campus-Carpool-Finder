import React, { useState } from 'react';
import { ratingService } from '../../services/ratingService';
import { Star, X, CheckCircle, AlertCircle } from 'lucide-react';

const RatingModal = ({ isOpen, onClose, rideId, targetUser, onRatingSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      const res = await ratingService.createRating({
        rideId,
        toUserId: targetUser._id,
        rating,
        review,
      });

      if (res.success) {
        if (onRatingSubmitted) onRatingSubmitted(res.rating);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit rating.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-100 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Rate Co-Traveller</h3>
            <p className="text-xs text-gray-500">Sharing feedback builds campus trust</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 text-xs p-3 bg-red-50 text-red-700 rounded-xl border border-red-100">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center mx-auto">
            {targetUser?.name?.charAt(0) || 'U'}
          </div>
          <h4 className="text-sm font-semibold text-gray-900">{targetUser?.name}</h4>
          <p className="text-xs text-gray-400">How was your journey experience?</p>

          {/* Star selector */}
          <div className="flex justify-center space-x-1.5 pt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1 focus:outline-none transition transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-200'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Review Comment (Optional)
            </label>
            <textarea
              rows={3}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="e.g. Great driver, arrived on time and smooth driving!"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 disabled:opacity-50 transition"
            >
              {submitting ? 'Submitting...' : 'Submit Rating'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingModal;
