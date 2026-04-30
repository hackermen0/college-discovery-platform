// frontend/components/colleges/CollegeCard.tsx
import Link from 'next/link';
import { Star, MapPin, IndianRupee, TrendingUp } from 'lucide-react';
import type { College } from '@/types/college';

interface CollegeCardProps {
  college: College;
  queryString?: string;
}

function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star size={16} className="text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={16} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} size={16} className="text-gray-300" />
      );
    }
  }
  return stars;
}

function formatFees(fees: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(fees);
}

export function CollegeCard({ college, queryString = '' }: CollegeCardProps) {
  const topCourses = college.courses.slice(0, 2);
  const href = `/colleges/${college.id}${queryString ? `?from=${encodeURIComponent(queryString)}` : ''}`;

  return (
    <Link href={href}>
      <div className="h-full bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer overflow-hidden flex flex-col">
        {/* Header Section with Rating */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-2 flex-1 mr-2">
              {college.name}
            </h3>
            <div className="flex-shrink-0 bg-white px-2 py-1 rounded-md shadow-sm">
              <div className="text-sm font-bold text-gray-900">{college.rating.toFixed(1)}</div>
            </div>
          </div>
          <div className="flex gap-1">
            {renderStars(college.rating)}
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col gap-3">
          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={16} className="text-blue-600 flex-shrink-0" />
            <span className="text-sm">{college.location}</span>
          </div>

          {/* Fees */}
          <div className="flex items-center gap-2">
            <IndianRupee size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-900">{formatFees(college.fees)}/year</span>
          </div>

          {/* Placement Rate */}
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-600 flex-shrink-0" />
            <span className="text-sm font-semibold text-gray-900">{college.placementRate}% placement rate</span>
          </div>

          {/* Average Salary */}
          <div className="text-xs text-gray-600">
            <span className="font-semibold">Avg. Salary:</span> ₹{college.placements.averageSalary} LPA
          </div>

          {/* Courses */}
          <div className="mt-auto">
            <p className="text-xs text-gray-500 mb-2 font-medium">Top Courses:</p>
            <div className="flex flex-wrap gap-1">
              {topCourses.map((course, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                >
                  {course}
                </span>
              ))}
            </div>
          </div>

          {/* Review Count */}
          <div className="text-xs text-gray-600 mt-2">
            <span className="font-semibold">{college.reviews.length}</span> reviews
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gray-50 px-4 py-3 border-t">
          <button className="w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition-colors text-sm">
            View Details
          </button>
        </div>
      </div>
    </Link>
  );
}
