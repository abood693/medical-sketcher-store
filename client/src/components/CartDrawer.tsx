import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";

const formatMoney = (amount: string, currency: string) => new Intl.NumberFormat(undefined, { style: "currency", currency }).format(Number(amount));

export function CartDrawer() {
  const { cart, isOpen, closeCart, loading, removeItem, updateQuantity, proceedToCheckout } = useCart();
  if (!isOpen) return null;
  const items = cart?.items ?? [];
  return (
    <div className="fixed inset-0 z-[80] bg-[#172019]/40 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Shopping cart">
      <button className="absolute inset-0 cursor-default" onClick={closeCart} aria-label="Close cart overlay" />
      <aside className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[#fffdf7] shadow-2xl" dir="ltr">
        <header className="flex items-center justify-between border-b border-[#283b25]/10 px-6 py-5">
          <div className="flex items-center gap-3"><ShoppingBag className="size-5 text-[#556b2f]" /><h2 className="font-display text-xl font-bold">Your library</h2></div>
          <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Close cart"><X className="size-5" /></Button>
        </header>
        <div className="flex-1 overflow-auto px-6 py-5">
          {items.length === 0 ? <p className="rounded-2xl bg-[#f1f0e9] p-5 text-sm text-[#667064]">Your book bag is ready whenever you are.</p> : items.map(item => (
            <article key={item.lineId} className="flex gap-4 border-b border-[#283b25]/10 py-4">
              {item.image ? <img src={item.image.url} alt={item.image.altText ?? item.productTitle} className="h-20 w-14 rounded-lg object-cover" /> : <div className="h-20 w-14 rounded-lg bg-[#dbe2c8]" />}
              <div className="min-w-0 flex-1"><h3 className="font-semibold leading-tight">{item.productTitle}</h3><p className="mt-1 text-sm text-[#667064]">{formatMoney(item.lineTotal.amount, item.lineTotal.currencyCode)}</p>
                <div className="mt-3 flex items-center gap-2"><Button variant="outline" size="icon" className="size-7" onClick={() => updateQuantity(item.lineId, Math.max(0, item.quantity - 1))}><Minus className="size-3" /></Button><span className="w-5 text-center text-sm">{item.quantity}</span><Button variant="outline" size="icon" className="size-7" onClick={() => updateQuantity(item.lineId, item.quantity + 1)}><Plus className="size-3" /></Button><button className="ml-auto text-xs text-[#8d4133] underline" onClick={() => removeItem(item.lineId)}>Remove</button></div>
              </div>
            </article>
          ))}
        </div>
        <footer className="border-t border-[#283b25]/10 p-6"><div className="mb-4 flex justify-between font-semibold"><span>Subtotal</span><span>{cart ? formatMoney(cart.subtotal.amount, cart.subtotal.currencyCode) : "—"}</span></div><Button className="w-full rounded-full bg-[#283b25] py-6 hover:bg-[#415a37]" disabled={!cart || loading} onClick={proceedToCheckout}>Secure checkout</Button><p className="mt-3 text-center text-xs text-[#667064]">Payments are completed securely through the store checkout.</p></footer>
      </aside>
    </div>
  );
}
