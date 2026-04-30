// frontend/app/colleges/[id]/page.tsx
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { Star, MapPin, IndianRupee, TrendingUp, ChevronLeft, Bookmark, Share2 } from 'lucide-react';
import { apiFetch } from '@/lib/api';
import type { GetCollegeResponse } from '@/types/college';
import type { Metadata } from 'next';
import { CompareToggleButton } from '@/components/compare/CompareToggleButton';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    from?: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const resolvedParams = await params as { id: string };
    const response = await apiFetch<GetCollegeResponse>(`/colleges/${resolvedParams.id}`, {
      method: 'GET'
    });
    const { data: college } = response;

    return {
      title: `${college.name} - College Details | AiSignal Demo`,
      description: college.overview,
      openGraph: {
        title: college.name,
        description: college.overview,
        type: 'website'
      }
    };
  } catch {
    return {
      title: 'College Not Found | AiSignal Demo',
      description: 'The college you are looking for does not exist'
    };
  }
}

function renderStars(rating: number) {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      stars.push(
        <Star key={i} size={18} className="fill-yellow-400 text-yellow-400" />
      );
    } else if (i === fullStars && hasHalfStar) {
      stars.push(
        <div key={i} className="relative">
          <Star size={18} className="text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star size={18} className="fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    } else {
      stars.push(
        <Star key={i} size={18} className="text-gray-300" />
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default async function CollegeDetailPage({ params, searchParams }: PageProps) {
  let college: GetCollegeResponse['data'];

  try {
    const resolvedParams = await params as { id: string };
    const response = await apiFetch<GetCollegeResponse>(`/colleges/${resolvedParams.id}`, {
      method: 'GET'
    });
    college = response.data;
  } catch (error) {
    console.error(error)
    notFound();
  }

  const session = await getServerSession();
  const resolvedSearchParams = await searchParams;
  const backUrl = resolvedSearchParams.from ? decodeURIComponent(resolvedSearchParams.from) : '/colleges';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <Link
            href={backUrl}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium w-fit"
          >
            <ChevronLeft size={20} />
            Back to Results
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-linear-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{college.name}</h1>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8 text-black">
            {/* Rating */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="text-sm text-black mb-2">Rating</div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">{college.rating.toFixed(1)}</div>
                <div className="flex gap-1">{renderStars(college.rating)}</div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-black mb-2">
                <MapPin size={16} />
                Location
              </div>
              <div className="text-lg font-semibold">{college.location}</div>
            </div>

            {/* Fees */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-black mb-2">
                <IndianRupee size={16} />
                Annual Fees
              </div>
              <div className="text-lg font-semibold">{formatFees(college.fees)}</div>
            </div>

            {/* Placement Rate */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4">
              <div className="flex items-center gap-2 text-sm text-black mb-2">
                <TrendingUp size={16} />
                Placement Rate
              </div>
              <div className="text-lg font-semibold">{college.placementRate}%</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-8">
            <CompareToggleButton collegeId={college.id} collegeName={college.name} />
            {session?.user ? (
              <button className="flex items-center gap-2 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                <Bookmark size={20} />
                Save College
              </button>
            ) : null}
            <button className="flex items-center gap-2 px-6 py-2 text-black bg-white bg-opacity-20 rounded-lg font-semibold hover:bg-opacity-30 transition-colors border border-white border-opacity-50">
              <Share2 size={20} />
              Share
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Overview Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">About the College</h2>
          <p className="text-gray-700 leading-relaxed text-lg">{college.overview}</p>
        </section>

        {/* Courses Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Courses Offered</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {college.courses.map((course) => (
              <div
                key={course}
                className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-gray-800">{course}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Placements Section */}
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Placement Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Salary Stats */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary Package</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Average Salary</div>
                  <div className="text-3xl font-bold text-blue-600">₹{college.placements.averageSalary} LPA</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Highest Salary</div>
                  <div className="text-3xl font-bold text-green-600">₹{college.placements.highestSalary} LPA</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Placement Rate</div>
                  <div className="flex items-center gap-2">
                    <div className="text-3xl font-bold text-emerald-600">{college.placements.placementRate}%</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-emerald-600 h-2 rounded-full"
                        style={{ width: `${college.placements.placementRate}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Recruiters */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Recruiters</h3>
              <div className="flex flex-wrap gap-2">
                {college.placements.topRecruiters.map((recruiter) => (
                  <span
                    key={recruiter}
                    className="px-3 py-2 bg-gray-100 text-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                  >
                    {recruiter}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reviews Section */}
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Student Reviews ({college.reviews.length})</h2>

          {college.reviews.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No reviews yet. Be the first to share your experience!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {college.reviews.map((review, idx) => (
                <div key={idx} className="pb-6 border-b border-gray-200 last:pb-0 last:border-b-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.author}</h4>
                      <p className="text-sm text-gray-500">{formatDate(review.date)}</p>
                    </div>
                    <div className="flex gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  <p className="text-gray-700 leading-relaxed mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Footer CTA */}
      <div className="bg-blue-600 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Interested in this college?</h3>
          <p className="text-blue-100 mb-6">Explore more colleges and compare their features</p>
          <Link
            href="/colleges"
            className="inline-block px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Browse More Colleges
          </Link>
        </div>
      </div>
    </div>
  );
}
