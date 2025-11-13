// lib/api/stores.ts

// Types based on API response
export interface StoreMetadata {
    brand_color: {
      accent: string
      primary: string
      secondary: string
    }
  }
  
  export interface StoreDetails {
    id: string
    vendor_id: string
    store_name: string
    business_type: string
    store_description: string
    store_url: string
    qr_url: string
    metadata: StoreMetadata
    updated_at: string
  }
  
  export interface StoreReview {
    id: string
    user_name: string
    rating: number
    comment: string
    store_id: string
    created_at: string
  }
  
  export interface StoreReviewsSummary {
    total_reviews: string
    reviews: StoreReview[] | null
  }
  
  export interface StoreDetailsResponse {
    status: string
    message: string
    data: {
      storeDetails: StoreDetails
      reviews: StoreReviewsSummary
    }
  }
  
  // API Configuration
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'
  
  // API Service Functions
  export const storeApi = {
    /**
     * Fetch store details by store ID
     * @param storeId - The unique identifier for the store
     * @returns Store details and reviews
     */
    async getStoreDetails(storeId: string): Promise<StoreDetailsResponse> {
      try {
        const response = await fetch(`${API_BASE_URL}/api/stores/${storeId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          // Enable caching for better performance
          next: { revalidate: 60 } // Revalidate every 60 seconds
        })
  
        if (!response.ok) {
          throw new Error(`Failed to fetch store details: ${response.statusText}`)
        }
  
        const data: StoreDetailsResponse = await response.json()
        return data
      } catch (error) {
        console.error('Error fetching store details:', error)
        throw error
      }
    },
  
    /**
     * Helper function to get user initials from username
     * @param username - The username to extract initials from
     * @returns Initials (e.g., "JD" for "John Doe")
     */
    getUserInitials(username: string): string {
      return username
        .split(' ')
        .map(name => name.charAt(0).toUpperCase())
        .slice(0, 2)
        .join('')
    },
  
    /**
     * Helper function to format date to relative time
     * @param dateString - ISO date string
     * @returns Relative time string (e.g., "2 days ago")
     */
    getRelativeTime(dateString: string): string {
      const date = new Date(dateString)
      const now = new Date()
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  
      if (diffInSeconds < 60) return 'Just now'
      if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
      if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`
      if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`
      if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`
      return `${Math.floor(diffInSeconds / 31536000)} years ago`
    }
  }
  
  // Export for use in components
  export default storeApi