'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMarketplaceStore } from '@/lib/store';
import { INITIAL_REVIEWS } from '@/lib/data';
import {
  Star,
  ShoppingBag,
  Store,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  MessageSquarePlus,
  Share2
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const { products, vendors, addToCart, addToast, currentUser, openAuthModal } = useMarketplaceStore();

  const product = products.find((p) => p.id === productId);
  const vendor = vendors.find((v) => v.id === product?.vendorId);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState(
    INITIAL_REVIEWS.filter((r) => r.productId === productId)
  );

  // Review form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-slate-500 text-sm mt-2 mb-6">
          The requested product listing may have been retired or does not exist.
        </p>
        <Link
          href="/products"
          className="px-5 py-2.5 rounded-xl bg-primary text-white text-xs font-semibold hover:bg-primary/90"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!currentUser) {
      openAuthModal('login');
      addToast({
        type: 'info',
        title: 'Sign In Required',
        message: 'Please sign in to your Kharidari.pk account to post a review.'
      });
      return;
    }

    setIsSubmittingReview(true);
    const review = {
      id: `rev_${Date.now()}`,
      productId: product.id,
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerImage: currentUser.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toISOString()
    };

    setTimeout(() => {
      setReviews([review, ...reviews]);
      setNewComment('');
      setIsSubmittingReview(false);
      addToast({
        type: 'success',
        title: 'Review Posted',
        message: 'Thank you for supporting this independent maker!'
      });
    }, 400);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-900 dark:hover:text-white mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back</span>
      </button>

      {/* Main product view */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Images */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm relative">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {discountPercent > 0 && (
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-md">
                Save {discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImageIndex === idx
                      ? 'border-primary ring-2 ring-primary/20 scale-95'
                      : 'border-slate-200 dark:border-slate-800 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Info & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Category and ratings */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                {product.categoryName || 'Curated Design'}
              </span>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-slate-400 font-normal">
                  ({reviews.length} reviews)
                </span>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-1">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-base text-slate-400 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2">
              {product.description}
            </p>

            {/* Stock status */}
            <div className="pt-2">
              {product.stock > 0 ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  In Stock &bull; Ready to dispatch ({product.stock} left)
                </span>
              ) : (
                <span className="text-xs font-semibold text-rose-500 bg-rose-50 px-2.5 py-1 rounded-full">
                  Sold Out
                </span>
              )}
            </div>

            {/* Vendor Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-3">
                <img
                  src={vendor?.logo || product.vendorLogo || 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200'}
                  alt={vendor?.storeName || 'Vendor'}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-700 bg-white"
                />
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {vendor?.storeName || product.vendorName}
                    </span>
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Direct Maker &bull; {vendor?.rating || 4.9}★ Store Rating
                  </p>
                </div>
              </div>

              <Link
                href={`/stores/${vendor?.slug || product.vendorSlug || 'apex-audio'}`}
                className="text-xs font-bold text-primary hover:underline shrink-0"
              >
                Visit Store
              </Link>
            </div>

            {/* Actions: Stepper + Add to Bag */}
            <div className="pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-bold text-slate-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={product.stock <= 0}
                  className="flex-1 py-3 px-6 rounded-xl bg-primary text-white font-semibold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 active:scale-[0.99]"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Add to Bag &bull; ${(product.price * quantity).toFixed(2)}</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 pt-2">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-slate-400" />
                  <span>Tracked Sub-Order</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Direct Atelier Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Customer Reviews ({reviews.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified feedback from buyers who purchased through this vendor.
            </p>
          </div>
        </div>

        {/* Submit Review Form */}
        <form
          onSubmit={handleAddReview}
          className="mb-10 p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 space-y-4"
        >
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <MessageSquarePlus className="w-4 h-4 text-primary" />
            <span>Leave a Review{currentUser ? ` as ${currentUser.name}` : ''}</span>
          </h4>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`w-5 h-5 ${
                      star <= newRating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300 dark:text-slate-700'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience regarding craftsmanship, packaging, and performance..."
            rows={3}
            required
            className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-slate-900 dark:text-white"
          />

          <button
            type="submit"
            disabled={isSubmittingReview}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold hover:opacity-90 transition-opacity"
          >
            {isSubmittingReview ? 'Posting...' : 'Submit Review'}
          </button>
        </form>

        {/* Reviews list */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No reviews yet for this listing.</p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={rev.customerImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
                      alt={rev.customerName}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 dark:text-white block">
                        {rev.customerName}
                      </span>
                      <span className="text-[10px] text-slate-400">Verified Buyer</span>
                    </div>
                  </div>

                  <div className="flex gap-0.5 text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                  {rev.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
