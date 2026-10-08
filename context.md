
## Single-branch storefront shopping

### Agreed customer flow
- One branch per cart; no All branches catalogue.
- Initial selection: valid branch link (?branch=id), then remembered branch,
  then the vendor's default online branch. If a cart already exists, its branch
  takes precedence until the customer confirms clearing it.
- Display Shopping from on retail and food storefronts and checkout.
- A branch controls products, option prices, availability, stock and fulfillment.
- Empty cart: switch immediately. Nonempty cart: Keep current branch or
  Clear cart and switch. No silent repricing or partial cart transfer.
- Clear checkout quotes, coupon reservations/validation, chosen shipping rates,
  pickup selection and stale product snapshots when switching.
- Location may suggest a branch but must not silently switch or change prices.
- Out-of-coverage addresses must prompt the customer, not auto-switch the cart.

### Vendor/API requirements
- Add default_online_branch_id using existing branch records, not duplicate
  pickup addresses. Require one enabled default; handle disabled/deleted branches.
- Shared products retain base prices. Branch records hold availability, stock,
  and optional price overrides at product/variant/portion/serving-option level.
- No override means inherit base price. Resolve branch override FIRST, then
  monetization markup exactly once. Price 2 is not a branch override.
- Read enabled branches with stable IDs, names, addresses, default flag, currency,
  hours and fulfillment capabilities; expose only public fields to customers.
- Catalogue/search/product-detail requests must include branch_id and return
  effective prices, stock and a pricing version for that branch.
- Cart, quote, coupon validation, shipping quote and order must include branch_id.
  Server must reject cross-store branches and mixed-branch items, and validate
  stock, price, coupon eligibility, address coverage and pickup ownership.
- Existing delivery-rate and pickup APIs must filter by branch. Do not attach
  an unrelated branch's address or fees to the selected branch.
- Reserve inventory per branch and decrement only after successful order/payment.
  Record immutable branch/pricing snapshots on orders for vendor fulfillment.
- Bind persisted carts to store_id + branch_id + pricing version. Revalidate
  old carts and handle cross-tab/device changes and expired quote/reservation state.
- Branch switching must release any server reservations idempotently.
- Tenant authorization, inventory permissions, audit logs, cache invalidation
  and concurrency protection must be enforced server-side.

### Current frontend preview and remaining integration
- Selector applies ONLY to mock retail/food storefronts; live stores and ticketing
  are unchanged. Two fixed preview branches demonstrate different prices and
  catalogue availability. They are not real vendor branches.
- Retail product detail resolves the same branch catalogue as listing.
- Food portions/serving prices use branch data; add-ons are not marked up again.
- Selected branch survives refresh; shared links support ?branch=main or lagos.
- Switching returns to the storefront catalogue and resets checkout draft/cart.
- Food pickup display uses the selected preview branch address.
- Vendor default-branch editing, per-branch inventory/price editing, real pickup
  and shipping eligibility are still API integration work, not synchronized here.
- No geolocation permission prompt, automatic nearest-branch selection or
  multi-branch checkout is introduced.
