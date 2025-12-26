import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import { apiGetFuelFriendDetails, apiGetFuelFriendReviews, apiAddReview } from '../services/api';
import { useAppContext } from '../App';
import AnimatedPage from '../components/AnimatedPage';

interface Review {
  id: string;
  userName: string;
  rating: number;
  createdAt: string;
  comment: string;
  userAvatar: string;
}

interface FuelFriend {
  id: string;
  fullName: string;
  deliveryFee: number;
  location: string;
  rating: number;
  totalReviews: number;
  profilePhoto: string;
  about: string;
}

const FuelFriendDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useAppContext();
  const [fuelFriend, setFuelFriend] = useState<FuelFriend | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const [friendData, reviewsData] = await Promise.all([
          apiGetFuelFriendDetails(id),
          apiGetFuelFriendReviews(id)
        ]);
        
        setFuelFriend(friendData);
        setReviews(reviewsData.map((review: any) => ({
          id: review.id,
          userName: review.userName || 'Anonymous',
          rating: review.rating,
          createdAt: formatDate(review.createdAt),
          comment: review.comment || '',
          userAvatar: review.userAvatar || '/avatar.png'
        })));
      } catch (error: any) {
        console.error('Failed to fetch fuel friend data:', error);
        if (error.message?.includes('not found')) {
          alert('Fuel friend not found');
          navigate("/home");
        } else {
          alert('Failed to load fuel friend details. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 60) return '1 month ago';
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  const ratingDistribution = [
    { stars: 5, percentage: 95 },
    { stars: 4, percentage: 4 },
    { stars: 3, percentage: 0 },
    { stars: 2, percentage: 0 },
    { stars: 1, percentage: 0 }
  ];

  const renderStars = (rating: number, interactive = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 cursor-pointer ${
          index < rating ? 'text-yellow-500 fill-current' : 'text-gray-300'
        }`}
        onClick={() => interactive && onStarClick && onStarClick(index + 1)}
      />
    ));
  };

  const handleAddReview = async () => {
    if (!newReview.trim() || newRating === 0 || !user?.id || !id) {
      alert('Please provide a rating and comment');
      return;
    }

    try {
      setSubmittingReview(true);
      await apiAddReview({
        customerId: user.id,
        fuelFriendId: id,
        rating: newRating,
        comment: newReview.trim()
      });
      
      // Refresh reviews
      const reviewsData = await apiGetFuelFriendReviews(id);
      setReviews(reviewsData.map((review: any) => ({
        id: review.id,
        userName: review.userName || 'Anonymous',
        rating: review.rating,
        createdAt: formatDate(review.createdAt),
        comment: review.comment || '',
        userAvatar: review.userAvatar || '/avatar.png'
      })));
      
      setNewReview('');
      setNewRating(0);
      alert('Review added successfully!');
    } catch (error: any) {
      console.error('Failed to add review:', error);
      alert(error.message || 'Failed to add review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleSelectFuelFriend = () => {
    // Navigate back to station details or checkout with selected fuel friend
    navigate("/home");
  };

  if (loading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <div className="w-8 h-8 border-4 border-[#3AC36C] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AnimatedPage>
    );
  }

  if (!fuelFriend) {
    return (
      <AnimatedPage>
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-red-500">Fuel friend not found</p>
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <header className="p-4 flex items-center sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
          <button 
            onClick={() => navigate("/home")} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
            <img src="/Back.png" alt="Back" className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-bold text-center flex-grow -ml-10 text-[#3F4249]">
            Fuel friend
          </h2>
        </header>

        {/* Profile Section */}
        <div className="px-4 py-6 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-orange-400 shadow-lg">
            <img 
              src={fuelFriend.profilePhoto || '/avatar.png'} 
              alt={fuelFriend.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='48' fill='%23e5e7eb'/%3E%3Cpath d='M48 24a12 12 0 1 0 0 24 12 12 0 0 0 0-24zM24 72a24 24 0 0 1 48 0H24z' fill='%23999'/%3E%3C/svg%3E";
              }}
            />
          </div>
          
          <h1 className="text-xl font-semibold text-[#3F4249] mb-2">{fuelFriend.fullName}</h1>
          
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-lg font-bold text-[#3F4249]">${fuelFriend.deliveryFee.toFixed(2)}</span>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
              <span className="font-semibold text-[#3F4249]">{fuelFriend.rating}</span>
              <span className="text-gray-600 ml-1">({fuelFriend.totalReviews})</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1 text-red-500" />
            <span className="text-sm">{fuelFriend.location}</span>
          </div>
        </div>

        {/* About Section */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-[#3F4249] mb-3">About</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            {fuelFriend.about || 'No description available.'}
          </p>
        </div>

        {/* Rating and Reviews Section */}
        <div className="px-4 mb-6">
          <h3 className="text-lg font-semibold text-[#3F4249] mb-4">Rating and Reviews</h3>
          
          {/* Overall Rating */}
          <div className="flex items-start space-x-6 mb-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-[#3F4249] mb-1">{fuelFriend.rating}</div>
              <div className="flex items-center mb-1">
                {renderStars(Math.floor(fuelFriend.rating))}
              </div>
              <div className="text-xs text-gray-600">{fuelFriend.totalReviews} All ratings</div>
            </div>
            
            {/* Rating Distribution */}
            <div className="flex-1">
              {ratingDistribution.map((item) => (
                <div key={item.stars} className="flex items-center mb-1">
                  <span className="text-sm text-gray-600 w-2">{item.stars}</span>
                  <Star className="w-3 h-3 text-yellow-500 fill-current mx-2" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-600 w-8">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Add Review Section - Only show if user is logged in */}
          {user ? (
            <div className="mb-6">
              <h4 className="font-semibold text-[#3F4249] mb-3">Add review</h4>
              <div className="flex items-center mb-3">
                {renderStars(newRating, true, setNewRating)}
              </div>
              <div className="relative">
                <textarea
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  placeholder="Your review here"
                  disabled={submittingReview}
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:outline-none focus:border-[#3AC36C] disabled:opacity-50"
                />
                <button
                  onClick={handleAddReview}
                  disabled={!newReview.trim() || newRating === 0 || submittingReview}
                  className="absolute bottom-3 right-3 bg-[#3AC36C] text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-[#2ea85a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-gray-600 mb-3">Please login to add a review</p>
              <button 
                onClick={() => navigate('/login')}
                className="bg-[#3AC36C] text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-[#2ea85a] transition-colors"
              >
                Login
              </button>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length > 0 ? reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-[#3F4249]">{review.userName}</h5>
                  <span className="text-xs text-gray-500">{review.createdAt}</span>
                </div>
                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                </div>
                {review.comment && (
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {review.comment}
                  </p>
                )}
              </div>
            )) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No reviews yet. Be the first to review!</p>
              </div>
            )}
          </div>

          {/* Read More */}
          <div className="mt-4 text-center">
            <button className="text-[#3AC36C] font-medium text-sm hover:underline">
              Read More
            </button>
          </div>
        </div>

        {/* Select Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
          <button 
            onClick={handleSelectFuelFriend}
            className="w-full bg-[#3AC36C] text-white py-4 rounded-full text-lg font-semibold hover:bg-[#2ea85a] transition-colors shadow-lg"
          >
            Select Fuel friend
          </button>
        </div>
      </div>
    </AnimatedPage>
  );
};

export default FuelFriendDetailsScreen;