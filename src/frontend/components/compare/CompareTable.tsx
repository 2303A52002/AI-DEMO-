'use client';

import React from 'react';
import { Trash2, Star, IndianRupee, GraduationCap, MapPin } from 'lucide-react';
import { CollegeWithRelations } from '@/shared/types';
import { StarRating } from '@/frontend/components/ui/StarRating';
import { Badge } from '@/frontend/components/ui/Badge';
import Link from 'next/link';

interface CompareTableProps {
  colleges: CollegeWithRelations[];
  onRemove: (collegeId: string, name: string) => void;
}

export function CompareTable({ colleges, onRemove }: CompareTableProps) {
  if (colleges.length === 0) {
    return (
      <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 max-w-lg mx-auto">
        <GraduationCap className="w-10 h-10 text-slate-500 mx-auto mb-4" />
        <h4 className="text-sm font-bold text-slate-200">No colleges selected</h4>
        <p className="text-xs text-slate-500 mt-1.5 max-w-xs mx-auto">
          Search and select at least two colleges to compare their fees, placements, ratings, and course details.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl scrollbar-thin scrollbar-thumb-slate-800">
      <table className="w-full min-w-[700px] border-collapse text-left text-sm text-slate-350">
        <thead>
          <tr className="border-b border-slate-850 bg-slate-900/90">
            <th className="p-4 w-1/4 min-w-[180px] font-bold text-slate-400 uppercase tracking-wider text-xs">
              Comparison Metric
            </th>
            {colleges.map((college) => (
              <th key={college.id} className="p-4 w-1/4 min-w-[200px] relative group align-top">
                {/* Remove trigger */}
                <button
                  onClick={() => onRemove(college.id, college.name)}
                  className="absolute top-2 right-2 p-1.5 bg-slate-950 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg border border-slate-800 transition-all cursor-pointer"
                  title="Remove from comparison"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <div className="flex flex-col gap-2 pt-2 pr-4">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-sky-400">
                    {college.accreditation}
                  </span>
                  <Link
                    href={`/colleges/${college.slug}`}
                    className="block text-xs font-black text-white hover:text-sky-400 transition-colors leading-tight line-clamp-2"
                  >
                    {college.name}
                  </Link>
                  <span className="text-[10px] text-slate-500 font-semibold">
                    Est. {college.established}
                  </span>
                </div>
              </th>
            ))}
            {/* If less than 3, fill empty spaces with placeholders */}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <th key={`empty-${i}`} className="p-4 w-1/4 min-w-[200px] text-center align-middle">
                  <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800/60 rounded-xl bg-slate-950/20 text-slate-600">
                    <span className="text-[10px] font-bold uppercase tracking-wider">Empty Spot</span>
                  </div>
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {/* Row 1: Location */}
          <tr className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
            <td className="p-4 font-bold text-slate-300 text-xs">Location</td>
            {colleges.map((college) => (
              <td key={college.id} className="p-4">
                <div className="flex items-center gap-1.5 text-xs text-slate-200">
                  <MapPin className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span>
                    {college.location}, {college.state}
                  </span>
                </div>
              </td>
            ))}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-loc-${i}`} className="p-4 text-slate-600 font-medium text-xs">-</td>
              ))}
          </tr>

          {/* Row 2: Average Fees */}
          <tr className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
            <td className="p-4 font-bold text-slate-300 text-xs">Annual Fees (Average)</td>
            {colleges.map((college) => (
              <td key={college.id} className="p-4 font-bold text-white">
                <div className="flex items-center text-xs">
                  <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                  <span>₹{college.fees.toLocaleString('en-IN')} / year</span>
                </div>
              </td>
            ))}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-fees-${i}`} className="p-4 text-slate-600 font-medium text-xs">-</td>
              ))}
          </tr>

          {/* Row 3: Placement */}
          <tr className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
            <td className="p-4 font-bold text-slate-300 text-xs">Placements</td>
            {colleges.map((college) => {
              const placement = college.placement;
              return (
                <td key={college.id} className="p-4">
                  {placement ? (
                    <div className="flex flex-col gap-1.5">
                      <div className="text-xs">
                        <span className="text-slate-500 font-semibold">Avg Salary: </span>
                        <span className="font-extrabold text-emerald-400">{placement.avgSalary} LPA</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500 font-semibold">Highest: </span>
                        <span className="font-extrabold text-sky-400">{placement.highestSalary} LPA</span>
                      </div>
                      <div className="text-[10px] text-slate-450 font-semibold">
                        <span>Placement Rate: {placement.placementPercent}%</span>
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">Not Available</span>
                  )}
                </td>
              );
            })}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-place-${i}`} className="p-4 text-slate-600 font-medium text-xs">-</td>
              ))}
          </tr>

          {/* Row 4: Star Rating */}
          <tr className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
            <td className="p-4 font-bold text-slate-300 text-xs">Platform Rating</td>
            {colleges.map((college) => (
              <td key={college.id} className="p-4">
                <div className="flex flex-col gap-1">
                  <StarRating rating={college.rating} size="sm" readonly />
                  <span className="text-[11px] font-bold text-slate-200 mt-1">
                    {college.rating.toFixed(1)} / 5 ({college.reviews?.length || college._count?.reviews || 0} reviews)
                  </span>
                </div>
              </td>
            ))}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-rating-${i}`} className="p-4 text-slate-600 font-medium text-xs">-</td>
              ))}
          </tr>

          {/* Row 5: Courses Count */}
          <tr className="border-b border-slate-850 hover:bg-slate-900/30 transition-colors">
            <td className="p-4 font-bold text-slate-300 text-xs">Courses Offered</td>
            {colleges.map((college) => {
              const courses = college.courses || [];
              return (
                <td key={college.id} className="p-4">
                  <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-bold text-slate-200">
                      {courses.length} Program{courses.length !== 1 ? 's' : ''}
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {courses.slice(0, 2).map((course) => (
                        <Badge key={course.id} variant="secondary" className="text-[9px] py-0 px-1.5 font-bold">
                          {course.name.replace('Bachelor of ', 'B.').replace('Master of ', 'M.')}
                        </Badge>
                      ))}
                      {courses.length > 2 && (
                        <span className="text-[9px] text-slate-500 font-bold">+{courses.length - 2} more</span>
                      )}
                    </div>
                  </div>
                </td>
              );
            })}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-courses-${i}`} className="p-4 text-slate-600 font-medium text-xs">-</td>
              ))}
          </tr>

          {/* Row 6: Recruiters */}
          <tr className="hover:bg-slate-900/30 transition-colors">
            <td className="p-4 font-bold text-slate-300 text-xs">Top Recruiters</td>
            {colleges.map((college) => {
              const recruiters = college.placement?.topRecruiters || [];
              return (
                <td key={college.id} className="p-4">
                  {recruiters.length > 0 ? (
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {recruiters.map((rec) => (
                        <Badge key={rec} variant="dark" className="text-[9px] py-0 px-1.5 font-semibold text-slate-300">
                          {rec}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-xs text-slate-500">-</span>
                  )}
                </td>
              );
            })}
            {colleges.length < 3 &&
              Array.from({ length: 3 - colleges.length }).map((_, i) => (
                <td key={`empty-recruiters-${i}`} className="p-4 text-slate-600 font-medium text-xs">-</td>
              ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
export default CompareTable;
