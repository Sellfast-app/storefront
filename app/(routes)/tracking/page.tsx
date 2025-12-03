"use client";

import React, { useState, useEffect } from 'react';
import { Package, MapPin, Truck, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface TrackingEvent {
  status: string;
  message: string;
  timestamp: string;
  location?: string;
}

interface TrackingData {
  tracking_code: string;
  status: string;
  status_name: string;
  last_updated: string;
  courier: string;
  delivery_eta: string;
  destination: {
    name: string;
    address: string;
  };
  origin: {
    name: string;
    address: string;
  };
  total_value: string;
  events: TrackingEvent[];
}

const TrackingPage = () => {
  const [trackingCode, setTrackingCode] = useState('');
  const [searchCode, setSearchCode] = useState('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Get tracking code from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    if (code) {
      setSearchCode(code);
      fetchTracking(code);
    }
  }, []);

  const fetchTracking = async (code: string) => {
    if (!code.trim()) {
      setError('Please enter a tracking code');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      // Updated to use query parameter instead of path parameter
      const response = await fetch(`/api/tracking?code=${encodeURIComponent(code)}`);
      const result = await response.json();

      if (!response.ok || result.status !== 'success') {
        throw new Error(result.message || 'Failed to fetch tracking information');
      }

      setTrackingData(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to fetch tracking information');
      setTrackingData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (trackingCode.trim()) {
      setSearchCode(trackingCode);
      fetchTracking(trackingCode);
      // Update URL without reload
      window.history.pushState({}, '', `/tracking?code=${trackingCode}`);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap: { [key: string]: { icon: React.ReactNode; label: string; color: string } } = {
      drafted: { icon: <AlertCircle className="w-5 h-5" />, label: 'On Hold', color: 'text-amber-500' },
      pending: { icon: <Clock className="w-5 h-5" />, label: 'Pending Pickup', color: 'text-blue-500' },
      pickup_started: { icon: <Package className="w-5 h-5" />, label: 'Pickup Started', color: 'text-primary' },
      pickup_completed: { icon: <Package className="w-5 h-5" />, label: 'Pickup Completed', color: 'text-primary' },
      in_delivery: { icon: <Truck className="w-5 h-5" />, label: 'Out for Delivery', color: 'text-primary' },
      in_transit: { icon: <Truck className="w-5 h-5" />, label: 'In Transit', color: 'text-primary' },
      delivered: { icon: <CheckCircle className="w-5 h-5" />, label: 'Delivered', color: 'text-green-500' },
    };

    return statusMap[status] || { icon: <Package className="w-5 h-5" />, label: status, color: 'text-gray-500' };
  };

  const trackingSteps = [
    { key: 'drafted', label: 'Order Confirmed' },
    { key: 'pending', label: 'Pending Pickup' },
    { key: 'pickup_started', label: 'Pickup Started' },
    { key: 'pickup_completed', label: 'Picked Up' },
    { key: 'in_transit', label: 'In Transit' },
    { key: 'in_delivery', label: 'Out for Delivery' },
    { key: 'delivered', label: 'Delivered' },
  ];

  const getCurrentStepIndex = (status: string) => {
    return trackingSteps.findIndex(step => step.key === status);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-background py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Track Your Order</h1>
          <p className="text-muted-foreground">Enter your tracking code to see real-time updates</p>
        </div>

        {/* Search Form */}
        <Card className="shadow-lg">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter tracking code (e.g., 0016517549)"
                value={trackingCode}
                onChange={(e) => setTrackingCode(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch(e);
                  }
                }}
                className="flex-1 h-12 text-base"
              />
              <Button onClick={handleSearch} size="lg" disabled={isLoading} className="px-8">
                {isLoading ? 'Tracking...' : 'Track'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && (
          <Card>
            <CardContent className="pt-6 space-y-4">
              <Skeleton className="h-8 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <div className="space-y-3 pt-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tracking Results */}
        {trackingData && !isLoading && (
          <div className="space-y-6">
            {/* Status Header */}
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Tracking Code</p>
                    <p className="text-2xl font-bold">{trackingData.tracking_code}</p>
                  </div>
                  <div className={`flex items-center gap-2 ${getStatusInfo(trackingData.status).color}`}>
                    {getStatusInfo(trackingData.status).icon}
                    <span className="font-semibold">{getStatusInfo(trackingData.status).label}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Courier</p>
                    <p className="font-medium">{trackingData.courier || 'N/A'}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Estimated Delivery</p>
                    <p className="font-medium">{formatDate(trackingData.delivery_eta)}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{formatDate(trackingData.last_updated)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">From</p>
                      <p className="font-semibold">{trackingData.origin.name}</p>
                      <p className="text-sm text-muted-foreground break-words">{trackingData.origin.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground">To</p>
                      <p className="font-semibold">{trackingData.destination.name}</p>
                      <p className="text-sm text-muted-foreground break-words">{trackingData.destination.address}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Timeline */}
            <Card className="shadow-lg">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-6">Shipment Progress</h3>
                <div className="relative">
                  {trackingSteps.map((step, index) => {
                    const currentIndex = getCurrentStepIndex(trackingData.status);
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                      <div key={step.key} className="relative pb-8 last:pb-0">
                        {/* Connector Line */}
                        {index < trackingSteps.length - 1 && (
                          <div
                            className={`absolute left-[19px] top-10 w-0.5 h-full ${
                              isActive ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          />
                        )}

                        {/* Step Content */}
                        <div className="flex items-start gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                              isActive
                                ? 'bg-primary text-primary-foreground shadow-lg'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                            } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                          >
                            {isActive ? (
                              trackingData.status === 'delivered' && isCurrent ? (
                                <CheckCircle className="w-5 h-5" />
                              ) : (
                                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                              )
                            ) : (
                              <div className="w-2 h-2 rounded-full bg-gray-400" />
                            )}
                          </div>
                          <div className="flex-1 pt-1">
                            <p
                              className={`font-semibold ${
                                isActive ? 'text-foreground' : 'text-muted-foreground'
                              }`}
                            >
                              {step.label}
                            </p>
                            {isCurrent && trackingData.last_updated && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {formatDate(trackingData.last_updated)}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Tracking Events */}
            {trackingData.events && trackingData.events.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-4">Tracking History</h3>
                  <div className="space-y-3">
                    {trackingData.events.map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50"
                      >
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium">{event.message}</p>
                          {event.location && (
                            <p className="text-sm text-muted-foreground">{event.location}</p>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(event.timestamp)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackingPage;