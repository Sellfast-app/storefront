# Ticket storefront API integration

The V2 ticket storefront uses the API as the source of truth for event availability, ticket capacity, pricing, payment initialization, and payment verification.

## Storefront requests

- `GET /api/tickets/stores/:storeId/events` proxies the public published-event list.
- `GET /api/v2/payment-methods/stores/:storeId` loads store-enabled and settlement-ready Paystack/SeerBit methods.
- `POST /api/tickets/checkout` creates a ticket order. The server computes discounts, markup, platform fees, capacity reservations, and final amount. Paid orders return an authorization URL; fully free orders return a confirmed order.
- `POST /api/tickets/verify/:reference` verifies a provider payment and issues admissions after confirmed payment.
- Provider callbacks return through `/payment/callback?kind=ticket`; the callback invokes ticket verification and only reports success after the API confirms it.

Ticket checkout sends the buyer's first name, last name, email and WhatsApp number, plus attendee names for each selected admission. Current UI uses the buyer as the attendee for every admission; a separate attendee-details flow can be added if product requirements call for buying tickets for others.

## Current limitation

The backend does not expose a buyer-authorized ticket history/retrieval endpoint. Ticket QR codes are emailed after confirmation. The storefront's “Your tickets” page therefore directs customers to that email rather than showing fabricated browser-local tickets. A secure retrieval endpoint (for example, an expiring email link or OTP-authenticated lookup) is required before a ticket wallet can be implemented.
