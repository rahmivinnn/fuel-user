import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';
import AnimatedPage from '../components/AnimatedPage';

interface Review {
  id: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

const FuelFriendDetailsScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [newReview, setNewReview] = useState('');
  const [newRating, setNewRating] = useState(0);

  // Mock fuel friend data
  const fuelFriend = {
    id: id || '1',
    name: 'Shah Hussain',
    price: 505.00,
    location: 'Abc Tennessee',
    rating: 4.8,
    totalReviews: 26,
    avatar: '/avatar.png',
    about: 'Fuel Friend is a reliable on-demand fuel delivery service designed to provide convenience and efficiency to customers. Whether you\'re stranded on the road or simply looking to avoid the hassle of gas stations, our trusted Fuel Friends ensure that you get quality fuel delivered right to your location.'
  };

  const reviews: Review[] = [
    {
      id: '1',
      userName: 'Saeed',
      rating: 5,
      date: '2 months ago',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.'
    },
    {
      id: '2',
      userName: 'Saeed',
      rating: 5,
      date: '2 months ago',
      comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce euismod, nunc vel tristique feugiat, libero justo vehicula purus.'
    }
  ];

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

  const handleAddReview = () => {
    if (newReview.trim() && newRating > 0) {
      // Here you would typically send the review to your API
      console.log('Adding review:', { rating: newRating, comment: newReview });
      setNewReview('');
      setNewRating(0);
      alert('Review added successfully!');
    }
  };

  const handleSelectFuelFriend = () => {
    // Navigate back to station details or checkout with selected fuel friend
    navigate(-1);
  };

  return (
    <AnimatedPage>
      <div className="min-h-screen bg-white pb-24">
        {/* Header */}
        <header className="p-4 flex items-center sticky top-0 bg-white z-10 shadow-sm border-b border-gray-100">
          <button 
            onClick={() => navigate(-1)} 
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
              src={fuelFriend.avatar} 
              alt={fuelFriend.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Ccircle cx='48' cy='48' r='48' fill='%23e5e7eb'/%3E%3Cpath d='M48 24a12 12 0 1 0 0 24 12 12 0 0 0 0-24zM24 72a24 24 0 0 1 48 0H24z' fill='%23999'/%3E%3C/svg%3E";
              }}
            />
          </div>
          
          <h1 className="text-xl font-semibold text-[#3F4249] mb-2">{fuelFriend.name}</h1>
          
          <div className="flex items-center justify-center space-x-4 mb-2">
            <span className="text-lg font-bold text-[#3F4249]">${fuelFriend.price.toFixed(2)}</span>
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
            {fuelFriend.about}
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

          {/* Add Review Section */}
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
                className="w-full p-3 border border-gray-300 rounded-lg resize-none h-20 text-sm focus:outline-none focus:border-[#3AC36C]"
              />
              <button
                onClick={handleAddReview}
                disabled={!newReview.trim() || newRating === 0}
                className="absolute bottom-3 right-3 bg-[#3AC36C] text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-[#2ea85a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-100 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-[#3F4249]">{review.userName}</h5>
                  <span className="text-xs text-gray-500">{review.date}</span>
                </div>
                <div className="flex items-center mb-2">
                  {renderStars(review.rating)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
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