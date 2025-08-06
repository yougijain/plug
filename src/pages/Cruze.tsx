import React, { useState } from 'react';
import { User, Ride } from '../types/index';
import { formatDistanceToNow, format } from 'date-fns';
import { TruckIcon, MapPinIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';

interface CruzeProps {
  currentUser: User;
}

const Cruze: React.FC<CruzeProps> = ({ currentUser }) => {
  const [selectedTab, setSelectedTab] = useState<'find' | 'offer'>('find');
  const [rides] = useState<Ride[]>([
    {
      id: '1',
      driver_id: 'user1',
      origin: 'Purdue Campus',
      destination: 'Indianapolis Airport',
      departure_time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      available_seats: 2,
      price: 15,
      description: 'Heading to the airport for spring break. Clean car, good music!',
      status: 'active',
      created_at: new Date().toISOString(),
    },
    {
      id: '2',
      driver_id: 'user2',
      origin: 'Purdue Campus',
      destination: 'Chicago Downtown',
      departure_time: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString(), // 6 hours from now
      available_seats: 1,
      price: 25,
      description: 'Weekend trip to Chicago. Can drop off anywhere downtown.',
      status: 'active',
      created_at: new Date().toISOString(),
    },
    {
      id: '3',
      driver_id: 'user3',
      origin: 'Purdue Campus',
      destination: 'Indianapolis Downtown',
      departure_time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(), // 1 hour from now
      available_seats: 3,
      price: 10,
      description: 'Quick trip to Indy. Flexible on pickup time.',
      status: 'active',
      created_at: new Date().toISOString(),
    },
  ]);

  const handleRequestRide = (rideId: string) => {
    alert(`Requesting ride ${rideId}`);
  };

  const handlePostRide = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Ride posted successfully!');
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center space-x-2">
          <TruckIcon className="h-6 w-6 text-blue-600" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Campus Cruze</h1>
            <p className="text-sm text-gray-500">Find or offer rides</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="px-4 py-4">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedTab('find')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'find'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Find a Ride
          </button>
          <button
            onClick={() => setSelectedTab('offer')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              selectedTab === 'offer'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Offer a Ride
          </button>
        </div>
      </div>

      {selectedTab === 'find' ? (
        /* Find Rides */
        <div className="px-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Available Rides</h2>
            <p className="text-sm text-gray-500">Connect with fellow students for rides</p>
          </div>

          <div className="space-y-4">
            {rides.map((ride) => (
              <div key={ride.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPinIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-900">
                        {ride.origin} → {ride.destination}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(ride.departure_time), 'MMM d, h:mm a')}
                      </span>
                    </div>
                    {ride.description && (
                      <p className="text-sm text-gray-600 mb-2">{ride.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-blue-600">${ride.price}</span>
                    <div className="flex items-center space-x-1 mt-1">
                      <UserGroupIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-xs text-gray-500">{ride.available_seats} seat{ride.available_seats !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(ride.departure_time), { addSuffix: true })}
                  </span>
                  <button 
                    onClick={() => handleRequestRide(ride.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Request Ride
                  </button>
                </div>
              </div>
            ))}
          </div>

          {rides.length === 0 && (
            <div className="text-center py-8">
              <TruckIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No rides available at the moment.</p>
              <p className="text-sm text-gray-400 mt-1">Check back later or offer a ride!</p>
            </div>
          )}
        </div>
      ) : (
        /* Offer Rides */
        <div className="px-4">
          <div className="mb-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Offer a Ride</h2>
            <p className="text-sm text-gray-500">Help fellow students and earn some gas money</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <form onSubmit={handlePostRide} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From
                </label>
                <input
                  type="text"
                  placeholder="Pickup location"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To
                </label>
                <input
                  type="text"
                  placeholder="Destination"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Seats
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price per Seat
                  </label>
                  <input
                    type="number"
                    placeholder="$0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (optional)
                </label>
                <textarea
                  placeholder="Tell passengers about your car, music preferences, etc."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Post Ride
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cruze; 