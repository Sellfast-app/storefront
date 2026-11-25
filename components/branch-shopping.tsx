"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { branchKey, previewBranches, supportsBranches } from "@/lib/branch-preview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BranchShopping({ children }: { children: React.ReactNode }) {
  const { storeId } = useParams<{ storeId: string }>();
  const isDemoStore = supportsBranches(storeId);
  const { clearCart, cart, hydrated } = useCart();
  const [ready, setReady] = useState(false);
  const [branches, setBranches] = useState<Array<{ id: string; name: string; address: string; is_default_online?: boolean }>>([]);
  const [branch, setBranch] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!hydrated) return;
    let cancelled = false;
    const initialize = async () => {
      try {
        const options: Array<{ id: string; name: string; address: string; is_default_online?: boolean }> = isDemoStore
          ? previewBranches.map(option => ({ ...option, is_default_online: option.isDefault }))
          : await fetch(`/api/stores/${encodeURIComponent(storeId)}/branches`, { cache: "no-store" })
              .then(async response => {
                const result = await response.json();
                if (!response.ok) throw new Error(result.message || "Unable to load branches");
                return Array.isArray(result.data) ? result.data : [];
              });
        if (cancelled) return;
        setBranches(options);
        if (!options.length) { setReady(true); return; }
        const remembered = localStorage.getItem(branchKey(storeId));
        const requested = new URLSearchParams(window.location.search).get("branch");
        const includes = (id: string | null): id is string => Boolean(id && options.some(option => option.id === id));
        const fallback = options.find(option => option.is_default_online)?.id || options[0].id;
        const current = includes(remembered) ? remembered : fallback;
        const target = includes(requested) ? requested : includes(remembered) ? remembered : fallback;
        const chosen = cart.length > 0 ? current : target;
        localStorage.setItem(branchKey(storeId), chosen);
        setBranch(chosen);
        setError("");
        setReady(true);
        if (cart.length > 0 && includes(requested) && requested !== current) setPending(requested);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : "Unable to load branch selection");
          setReady(true);
        }
      }
    };
    void initialize();
    return () => { cancelled = true; };
  }, [storeId, isDemoStore, hydrated, cart.length]);
  const switchBranch = (next: string) => {
    try {
      localStorage.setItem(branchKey(storeId), next);
      clearCart();
      // Clear both supported cart keys so branch switches from custom-domain roots
      // cannot rehydrate the previous branch's cart on the destination route.
      localStorage.removeItem("swiftree_cart_" + storeId);
      if (!window.location.pathname.match(/\/storefront\/[^/]+/)) {
        localStorage.removeItem("swiftree_cart");
      }
      sessionStorage.removeItem("checkout_draft_" + storeId);
      // Discard branch-specific product snapshots and delivery/coupon state on navigation.
      Object.keys(sessionStorage).filter(key => key.startsWith("storefront_product_" + storeId + "_") || key === "storefront_products_" + storeId).forEach(key => sessionStorage.removeItem(key));
      const url = new URL("/storefront/" + encodeURIComponent(storeId), window.location.origin);
      url.searchParams.set("branch", next);
      window.location.assign(url.toString());
    } catch { setError("Unable to switch branch. Please try again."); }
  };
  if (!ready) return <div className="p-6"><div className="h-16 animate-pulse bg-gray-100" aria-label="Loading branch" /></div>;
  if (error && !isDemoStore) return <div className="mx-auto max-w-3xl px-4 py-16 text-center"><h2 className="text-lg font-semibold">Store locations unavailable</h2><p role="alert" className="mt-2 text-sm text-gray-600">We couldn&apos;t load current branch availability and pricing. Please try again.</p><Button className="mt-4 bg-[#005B14] text-white" onClick={() => window.location.reload()}>Try again</Button></div>;
  if (!branches.length) return <>{children}</>;
  return <>
    <div className="border-b bg-white px-4 py-3 text-[#111827]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 shrink-0 text-[#005B14]" />
        <label htmlFor="shopping-branch">Shopping from</label>
        <select id="shopping-branch" value={branch} className="min-w-0 max-w-full cursor-pointer rounded-md border bg-white px-3 py-2 text-base"
          onChange={event => {
            const next = event.target.value;
            if (!branches.some(option => option.id === next) || next === branch) return;
            try {
              if (!hydrated) return;
              if (cart.length) setPending(next); else switchBranch(next);
            } catch { setError("Unable to read your cart. Reload before switching branches."); }
          }}>
          {branches.map(option => <option key={option.id} value={option.id}>{option.name} · {option.address}</option>)}
        </select>
        {branches.length > 1 && <span className="basis-full pl-6 text-xs text-gray-600">Choose a branch to see its products, prices, and availability.</span>}
        {error && <p role="alert" className="text-red-600">{error}</p>}
      </div>
    </div>
    {children}
    <Dialog open={!!pending} onOpenChange={open => { if (!open) setPending(null); }}>
      <DialogContent><DialogHeader><DialogTitle>Switch branch?</DialogTitle></DialogHeader>
        <p className="text-sm text-gray-600">Your cart contains items from {branches.find(item => item.id === branch)?.name}. Switching to {branches.find(item => item.id === pending)?.name} will clear your cart because prices and availability may differ.</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setPending(null)}>Keep current branch</Button>
          <Button className="bg-[#005B14] text-white" onClick={() => { if (pending) switchBranch(pending); }}>Clear cart and switch</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
