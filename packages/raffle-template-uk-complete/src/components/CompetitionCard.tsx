/**
 * Competition Card Component
 * Displays individual competition with all UK raffle features
 */

"use client";

import { useState, useEffect } from "react";
import {
  Clock,
  Users,
  Trophy,
  Ticket,
  Heart,
  ArrowRight,
  AlertCircle,
  Zap,
} from "lucide-react";

export interface CompetitionCardProps {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  value: string;
  ticketPrice: string;
  maxTickets: number;
  soldTickets: number;
  drawDate: string;
  endTime: Date;
  odds?: string;
  charity?: string;
  maxPerPerson?: number;
  isFlash?: boolean;
  isFeatured?: boolean;
  cashAlternative?: string;
}

export function CompetitionCard({
  title,
  subtitle,
  image,
  value,
  ticketPrice,
  maxTickets,
  soldTickets,
  drawDate,
  endTime,
  odds,
  charity,
  maxPerPerson = 9999,
  isFlash = false,
  isFeatured = false,
  cashAlternative,
}: CompetitionCardProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const soldPercentage = (soldTickets / maxTickets) * 100;
  const remaining = maxTickets - soldTickets;

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Badge Section */}
      {(isFeatured || isFlash) && (
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          {isFeatured && (
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
              <Trophy className="w-3 h-3" />
              FEATURED
            </div>
          )}
          {isFlash && (
            <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 animate-pulse">
              <Zap className="w-3 h-3" />
              FLASH
            </div>
          )}
        </div>
      )}

      {/* Image Section */}
      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {image}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-white">
            <div className="text-2xl font-bold">{value}</div>
            {cashAlternative && (
              <div className="text-sm opacity-90">
                or {cashAlternative} cash
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>
        {subtitle && <p className="text-sm text-gray-600 mb-3">{subtitle}</p>}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-4 h-4 text-blue-500" />
            <div>
              <div className="text-xs text-gray-500">Ticket Price</div>
              <div className="font-bold text-blue-600">{ticketPrice}</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-500" />
            <div>
              <div className="text-xs text-gray-500">Odds</div>
              <div className="font-bold text-green-600">
                {odds || `1 in ${Math.ceil(maxTickets / 100)}`}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">
              <span className="font-bold text-gray-900">
                {soldTickets.toLocaleString()}
              </span>{" "}
              sold
            </span>
            <span className="text-gray-600">
              <span className="font-bold text-orange-500">
                {remaining.toLocaleString()}
              </span>{" "}
              left
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${soldPercentage}%` }}
            >
              <div className="h-full bg-white/30 animate-pulse"></div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {soldPercentage.toFixed(1)}% sold • Max {maxPerPerson} per person
          </div>
        </div>

        {/* Timer */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600" />
              <span className="text-xs text-gray-600">Ends in:</span>
            </div>
            <div className="flex gap-3">
              {timeLeft.days > 0 && (
                <div className="text-center">
                  <div className="font-bold text-gray-900">
                    {timeLeft.days}d
                  </div>
                </div>
              )}
              <div className="text-center">
                <div className="font-bold text-gray-900">{timeLeft.hours}h</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-gray-900">
                  {timeLeft.minutes}m
                </div>
              </div>
              <div className="text-center">
                <div className="font-bold text-red-500">
                  {timeLeft.seconds}s
                </div>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-2">Draw: {drawDate}</div>
        </div>

        {/* Charity Badge */}
        {charity && (
          <div className="flex items-center gap-2 mb-4 p-2 bg-pink-50 rounded-lg">
            <Heart className="w-4 h-4 text-pink-500" />
            <span className="text-xs text-gray-700">Supporting {charity}</span>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex gap-2">
          <button className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2">
            Enter Now
            <ArrowRight className="w-4 h-4" />
          </button>
          <button className="px-4 py-3 border-2 border-gray-300 hover:border-gray-400 rounded-lg transition-colors">
            <AlertCircle className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
