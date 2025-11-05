import React, { useState } from "react";
import { FaStar, FaUserCircle, FaPaperclip } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";

const REVIEWS_PER_PAGE = 5;

const ReviewsTab = ({ displayReviews, setDisplayReviews }) => {
  const [newRating, setNewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [newImages, setNewImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setNewImages(urls);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newRating === 0 || newComment.trim() === "") return;

    const newReview = {
      id: uuidv4(),
      user: "Anonymous",
      rating: newRating,
      comment: newComment,
      images: newImages,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    };

    setDisplayReviews([newReview, ...displayReviews]);
    setNewRating(0);
    setHoverRating(0);
    setNewComment("");
    setNewImages([]);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(displayReviews.length / REVIEWS_PER_PAGE);
  const paginatedReviews = displayReviews.slice(
    (currentPage - 1) * REVIEWS_PER_PAGE,
    currentPage * REVIEWS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-12 lg:flex-row-reverse lg:gap-20 font-sans">
      {/* Submit Review Form */}
      <div className="lg:w-1/3">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-200 animate-fade-in"
        >
          <h3 className="font-bold text-3xl mb-4 text-gray-800 tracking-tight">
            Write a Review
          </h3>
          <p className="text-gray-500 mb-6 text-sm">
            Share your experience to help others.
          </p>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={24}
                  className={`cursor-pointer transition-transform duration-300 transform hover:scale-125 ${
                    (hoverRating || newRating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                  onClick={() => setNewRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
              <span className="ml-4 text-sm text-gray-500 font-medium">
                {hoverRating
                  ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                      hoverRating - 1
                    ]
                  : newRating > 0
                  ? ["Poor", "Fair", "Good", "Very Good", "Excellent"][
                      newRating - 1
                    ]
                  : "Select a rating"}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Your Review
            </label>
            <textarea
              className="w-full border border-gray-300 p-4 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
              rows={5}
              placeholder="What did you like or dislike? What should others know?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Add Photos
            </label>
            <div className="flex items-center">
              <label
                htmlFor="image-upload"
                className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-full cursor-pointer hover:bg-gray-200 transition-colors duration-200 text-sm"
              >
                <FaPaperclip className="mr-2" />
                Upload Images
              </label>
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            <div className="flex gap-3 flex-wrap mt-4">
              {newImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt="preview"
                  className="w-24 h-24 object-cover rounded-xl border border-gray-300 shadow-sm transition-transform duration-300 transform hover:scale-105"
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-bold text-white transition-all duration-300 transform active:scale-95 ${
              newRating === 0 || newComment.trim() === ""
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg"
            }`}
            disabled={newRating === 0 || newComment.trim() === ""}
          >
            Submit Review
          </button>
        </form>
      </div>

      {/* Display Reviews */}
      <div className="lg:w-2/3">
        <h3 className="font-bold text-3xl mb-6 text-gray-800 tracking-tight">
          Customer Reviews ({displayReviews.length})
        </h3>
        {paginatedReviews.length > 0 ? (
          <div className="space-y-6">
            {paginatedReviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 transition-transform duration-300 transform hover:scale-[1.01] animate-fade-in"
              >
                <div className="flex items-start gap-4 mb-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <FaUserCircle size={48} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-gray-800 text-lg">
                        {rev.user}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {rev.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-400 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          size={16}
                          className={
                            i < rev.rating ? "text-yellow-400" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed mt-2">
                  {rev.comment}
                </p>

                {rev.images && rev.images.length > 0 && (
                  <div className="flex gap-3 flex-wrap mt-4">
                    {rev.images.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt="review"
                        className="w-24 h-24 object-cover rounded-xl border border-gray-300 shadow-sm transition-transform duration-300 transform hover:scale-105"
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-10">
            Be the first to leave a review! ✨
          </p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-10 h-10 rounded-full font-bold transition-all duration-300 ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md transform scale-110"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;