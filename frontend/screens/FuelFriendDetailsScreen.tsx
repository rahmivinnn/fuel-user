import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star } from 'lucide-react';
import { apiGetFuelFriendDetails, apiGetFuelFriendReviews } from '../services/api';
import AnimatedPage from '../components/AnimatedPage';

interface FuelFriend {
  id: string;
  fullName: string;
  location: string;
  deliveryFee: number;
  rating: number;
  totalReviews: number;
  profilePhoto: string;
  about: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  userName: string;
  userAvatar: string;
}

const FuelFriendDetailsScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [fuelFriend, setFuelFriend] = useState<FuelFriend | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFuelFriendData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const [friendData, reviewsData] = await Promise.all([
          apiGetFuelFriendDetails(id),
          apiGetFuelFriendReviews(id)
        ]);
        setFuelFriend(friendData);
        setReviews(reviewsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFuelFriendData();
  }, [id]);

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    
    const total = reviews.length || 1;
    return Object.entries(distribution).reverse().map(([rating, count]) => ({
      rating: parseInt(rating),
      percentage: Math.round((count / total) * 100)
    }));
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return diffInMonths === 0 ? 'This month' : `${diffInMonths} months ago`;
  };

  if (isLoading) {
    return (
      <AnimatedPage>
        <div className="bg-white min-h-screen pb-24">
          {/* Header Skeleton */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="w-6 h-6 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-24 h-5 bg-gray-300 rounded animate-pulse"></div>
            <div className="w-6"></div>
          </div>

          {/* Profile Section Skeleton */}
          <div className="px-4 py-6 text-center">
            <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-32 h-6 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="w-40 h-4 bg-gray-300 rounded mx-auto mb-2 animate-pulse"></div>
            <div className="w-28 h-4 bg-gray-300 rounded mx-auto animate-pulse"></div>
          </div>

          {/* About Section Skeleton */}
          <div className="px-4 mb-6">
            <div className="w-16 h-5 bg-gray-300 rounded mb-3 animate-pulse"></div>
            <div className="space-y-2">
              <div className="w-full h-3 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-5/6 h-3 bg-gray-300 rounded animate-pulse"></div>
              <div className="w-4/5 h-3 bg-gray-300 rounded animate-pulse"></div>
            </div>
          </div>

          {/* Rating Section Skeleton */}
          <div className="px-4 mb-6">
            <div className="w-40 h-5 bg-gray-300 rounded mb-4 animate-pulse"></div>
            <div className="flex items-start space-x-6 mb-6">
              <div className="text-center">
                <div className="w-12 h-8 bg-gray-300 rounded mb-2 animate-pulse"></div>
                <div className="w-16 h-3 bg-gray-300 rounded mb-1 animate-pulse"></div>
                <div className="w-20 h-3 bg-gray-300 rounded animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-3 h-3 bg-gray-300 rounded animate-pulse"></div>
                    <div className="flex-1 h-2 bg-gray-300 rounded animate-pulse"></div>
                    <div className="w-8 h-3 bg-gray-300 rounded animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimatedPage>
    );
  }

  if (error || !fuelFriend) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">{error || 'Fuel friend not found'}</p>
        </div>
      </AnimatedPage>
    );
  }

  const ratingDistribution = getRatingDistribution();

  return (
    <AnimatedPage>
      <div className="bg-white min-h-screen pb-24">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">Fuel friend</h1>
          <div className="w-9"></div>
        </div>

        {/* Profile Section */}
        <div className="px-4 py-6 text-center">
          <div className="relative inline-block mb-4">
            <img
              src={fuelFriend.profilePhoto || '/avatar.png'}
              alt={fuelFriend.fullName}
              className="w-24 h-24 rounded-full object-cover mx-auto"
              onError={(e) => {
                e.currentTarget.src = '/avatar.png';
              }}
            />
            <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">{fuelFriend.fullName}</h2>
          
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-lg font-semibold">${fuelFriend.deliveryFee}</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className="font-medium">{fuelFriend.rating}</span>
              <span className="text-gray-600 ml-1">({fuelFriend.totalReviews})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-red-500" />
            <span>{fuelFriend.location}</span>
          </div>
        </div>

        {/* About Section */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {fuelFriend.about || 'No description available.'}
          </p>
        </div>

        {/* Rating and Reviews Section */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating and Reviews</h3>
          
          {/* Rating Overview */}
          <div className="flex items-start space-x-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">{fuelFriend.rating}</div>
              <div className="flex items-center justify-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(fuelFriend.rating)
                        ? 'text-yellow-500 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-600">{fuelFriend.totalReviews} All ratings</div>
            </div>
            
            <div className="flex-1">
              {ratingDistribution.map(({ rating, percentage }) => (
                <div key={rating} className="flex items-center space-x-2 mb-1">
                  <span className="text-sm w-2">{rating}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-current" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review */}
          <div className="border border-gray-200 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Add review</span>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-5 h-5 text-gray-300 cursor-pointer hover:text-yellow-500" />
                ))}
              </div>
            </div>
            <input
              type="text"
              placeholder="Your review here"
              className="w-full text-sm text-gray-600 bg-transparent border-none outline-none mb-3"
            />
            <div className="flex justify-end">
              <button className="bg-green-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                Add
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.slice(0, 2).map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium">{review.userName}</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-3 h-3 ${
                          star <= review.rating
                            ? 'text-yellow-500 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{formatTimeAgo(review.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>

          {reviews.length > 2 && (
            <button className="text-gray-600 text-sm mt-4">Read More</button>
          )}
        </div>

        {/* Select Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button
            onClick={() => navigate(-1, { state: { selectedFuelFriend: fuelFriend } })}
            className="w-full bg-green-500 text-white py-4 rounded-full text-lg font-semibold"
          >
            Select Fuel friend
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FuelFriendDetailsScreen;