"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { BranchId, branchKey, previewBranches, resolveBranch, supportsBranches, validBranch } from "@/lib/branch-preview";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function BranchShopping({ children }: { children: React.ReactNode }) {
  const { storeId } = useParams<{ storeId: string }>();
  const enabled = supportsBranches(storeId);
  const { clearCart, cart } = useCart();
  const [ready, setReady] = useState(false);
  const [branch, setBranch] = useState<BranchId>("main");
  const [pending, setPending] = useState<BranchId | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!enabled) { setReady(true); return; }
    try {
      const remembered = localStorage.getItem(branchKey(storeId));
      const requested = new URLSearchParams(window.location.search).get("branch");
      const current = resolveBranch(null, remembered);
      const target = resolveBranch(requested, remembered);
      const stored = JSON.parse(localStorage.getItem("swiftree_cart_" + storeId) || "[]");
      const hasCart = Array.isArray(stored) && stored.length > 0;
      const chosen = hasCart ? current : target;
      localStorage.setItem(branchKey(storeId), chosen);
      setBranch(chosen);
      if (hasCart && target !== current) setPending(target);
      setReady(true);
    } catch { setError("Unable to load branch selection. Please allow browser storage and reload."); }
  }, [storeId, enabled]);
  const switchBranch = (next: BranchId) => {
    try {
      localStorage.setItem(branchKey(storeId), next);
      clearCart();
      sessionStorage.removeItem("checkout_draft_" + storeId);
      // Discard branch-specific product snapshots and delivery/coupon state on navigation.
      Object.keys(sessionStorage).filter(key => key.startsWith("storefront_product_" + storeId + "_") || key === "storefront_products_" + storeId).forEach(key => sessionStorage.removeItem(key));
      window.location.assign("/storefront/" + storeId + "?branch=" + next);
    } catch { setError("Unable to switch branch. Please try again."); }
  };
  if (!enabled) return children;
  if (!ready) return <div className="p-6">{error ? <p role="alert">{error}</p> : <div className="h-16 animate-pulse bg-gray-100" aria-label="Loading branch" />}</div>;
  return <>
    <div className="border-b bg-white px-4 py-3 text-[#111827]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 text-sm">
        <MapPin className="h-4 w-4 shrink-0 text-[#005B14]" />
        <label htmlFor="shopping-branch">Shopping from</label>
        <select id="shopping-branch" value={branch} className="min-w-0 max-w-full rounded-md border px-3 py-2 text-base"
          onChange={event => {
            const next = event.target.value;
            if (!validBranch(next) || next === branch) return;
            try {
              if (cart.length) setPending(next); else switchBranch(next);
            } catch { setError("Unable to read your cart. Reload before switching branches."); }
          }}>
          {previewBranches.map(option => <option key={option.id} value={option.id}>{option.name} · {option.address}</option>)}
        </select>
        {error && <p role="alert" className="text-red-600">{error}</p>}
      </div>
    </div>
    {children}
    <Dialog open={!!pending} onOpenChange={open => { if (!open) setPending(null); }}>
      <DialogContent><DialogHeader><DialogTitle>Switch branch?</DialogTitle></DialogHeader>
        <p className="text-sm text-gray-600">Your cart contains items from {previewBranches.find(item => item.id === branch)?.name}. Switching to {previewBranches.find(item => item.id === pending)?.name} will clear your cart because prices and availability may differ.</p>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => setPending(null)}>Keep current branch</Button>
          <Button className="bg-[#005B14] text-white" onClick={() => { if (pending) switchBranch(pending); }}>Clear cart and switch</Button>
        </div>
      </DialogContent>
    </Dialog>
  </>;
}
