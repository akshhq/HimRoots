import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { addressService } from "@/services/addressService";
import { userOrderService, type UserOrderWithItems } from "@/services/userOrderService";
import type { AddressRow, AddressInsert } from "@/types/database.types";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/common/SEO";
import {
  User as UserIcon,
  Package,
  MapPin,
  ShoppingBag,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  FileText,
  X,
  Sparkles
} from "lucide-react";

export default function Account() {
  const navigate = useNavigate();
  const { user, profile, signOut, updateProfile, isLoading: authLoading } = useAuthStore();
  const { items: cartItems, getTotals } = useCartStore();
  const { subtotal } = getTotals();

  // Active tab state
  const [activeTab, setActiveTab] = useState<"orders" | "addresses" | "profile" | "cart">("orders");

  // Orders state
  const [orders, setOrders] = useState<UserOrderWithItems[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState<UserOrderWithItems | null>(null);

  // Addresses state
  const [addresses, setAddresses] = useState<AddressRow[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressRow | null>(null);
  const [addressForm, setAddressForm] = useState<Omit<AddressInsert, "user_id">>({
    label: "Home",
    name: "",
    phone: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    is_default: false,
  });

  // Profile form state
  const [profileName, setProfileName] = useState(() => profile?.full_name || user?.user_metadata?.full_name || "");
  const [profilePhone, setProfilePhone] = useState(() => profile?.phone || user?.user_metadata?.phone || "");
  const [profileStatus, setProfileStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [savingProfile, setSavingProfile] = useState(false);

  // Sync profile fields if profile or user becomes available/updated
  const [syncedProfileKey, setSyncedProfileKey] = useState<string>("");
  const currentProfileKey = `${user?.id || ""}-${profile?.full_name || ""}-${profile?.phone || ""}`;
  if (user && syncedProfileKey !== currentProfileKey) {
    setSyncedProfileKey(currentProfileKey);
    setProfileName(profile?.full_name || user.user_metadata?.full_name || "");
    setProfilePhone(profile?.phone || user.user_metadata?.phone || "");
  }

  // Load user data
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/account/login?redirect=/account");
      return;
    }

    if (user) {
      // Load orders
      userOrderService
        .fetchUserOrders(user.id, user.email)
        .then((data) => setOrders(data))
        .finally(() => setLoadingOrders(false));

      // Load addresses
      addressService
        .fetchUserAddresses(user.id)
        .then((data) => setAddresses(data))
        .finally(() => setLoadingAddresses(false));
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileStatus(null);

    const res = await updateProfile({
      full_name: profileName.trim(),
      phone: profilePhone.trim(),
    });

    setSavingProfile(false);
    if (res.error) {
      setProfileStatus({ type: "error", message: res.error });
    } else {
      setProfileStatus({ type: "success", message: "Profile updated successfully." });
      setTimeout(() => setProfileStatus(null), 3000);
    }
  };

  const handleOpenAddressModal = (addressToEdit?: AddressRow) => {
    if (addressToEdit) {
      setEditingAddress(addressToEdit);
      setAddressForm({
        label: addressToEdit.label,
        name: addressToEdit.name,
        phone: addressToEdit.phone,
        address_line1: addressToEdit.address_line1,
        address_line2: addressToEdit.address_line2 || "",
        city: addressToEdit.city,
        state: addressToEdit.state,
        pincode: addressToEdit.pincode,
        country: addressToEdit.country,
        is_default: addressToEdit.is_default,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        label: "Home",
        name: profile?.full_name || "",
        phone: profile?.phone || "",
        address_line1: "",
        address_line2: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        is_default: addresses.length === 0,
      });
    }
    setShowAddressModal(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (editingAddress) {
      const res = await addressService.updateUserAddress(editingAddress.id, addressForm);
      if (res.data) {
        setAddresses((prev) =>
          prev.map((a) => (a.id === editingAddress.id ? res.data! : addressForm.is_default ? { ...a, is_default: false } : a))
        );
        setShowAddressModal(false);
      }
    } else {
      const res = await addressService.createUserAddress({
        ...addressForm,
        user_id: user.id,
      });
      if (res.data) {
        setAddresses((prev) => [
          res.data!,
          ...(addressForm.is_default ? prev.map((a) => ({ ...a, is_default: false })) : prev),
        ]);
        setShowAddressModal(false);
      }
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Are you sure you want to remove this address?")) return;
    const res = await addressService.deleteUserAddress(addressId);
    if (res.success) {
      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    if (!user) return;
    const res = await addressService.setDefaultAddress(addressId, user.id);
    if (res.success) {
      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          is_default: a.id === addressId,
        }))
      );
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const memberSince = user.created_at
    ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "Recent";

  return (
    <>
      <SEO
        title="My Account | Himroots Wellness"
        description="Manage your Himroots customer profile, saved delivery addresses, order history, and synced shopping cart."
        canonical="/account"
        noindex={true}
      />

      <div className="py-10 sm:py-16 md:py-20 bg-[var(--color-background)] min-h-[90vh]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Header Banner */}
          <div className="bg-[#0a0a0a] border border-[var(--color-border-gold)] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 gold-glow-sm">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1a1a1a] to-black border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] font-serif text-2xl sm:text-3xl font-bold shadow-lg">
                {(profile?.full_name || user.email || "H").charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-serif text-xl sm:text-2xl font-bold text-white">
                    {profile?.full_name || "Himroots Patron"}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[var(--color-primary)]/15 text-[var(--color-primary)] border border-[var(--color-primary)]/30">
                    Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 mt-0.5">{user.email}</p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Patron since {memberSince} • Encrypted Supabase Profile
                </p>
              </div>
            </div>

            {/* Quick Action / Sign Out */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-xs uppercase tracking-wider text-gray-400 hover:text-white border-[var(--color-border)] hover:border-red-500/50 hover:bg-red-950/20"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" /> Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
            <button
              onClick={() => setActiveTab("orders")}
              className="bg-[#0a0a0a] border border-[var(--color-border)] hover:border-[var(--color-border-gold)] p-4 rounded-xl text-left transition-all"
            >
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Orders</span>
                <Package className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                {orders.length}
              </div>
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className="bg-[#0a0a0a] border border-[var(--color-border)] hover:border-[var(--color-border-gold)] p-4 rounded-xl text-left transition-all"
            >
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Addresses</span>
                <MapPin className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-white">
                {addresses.length}
              </div>
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className="bg-[#0a0a0a] border border-[var(--color-border)] hover:border-[var(--color-border-gold)] p-4 rounded-xl text-left transition-all"
            >
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Cart Items</span>
                <ShoppingBag className="w-4 h-4 text-[var(--color-primary)]" />
              </div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-gold-gradient">
                {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
              </div>
            </button>
          </div>

          {/* Dashboard Navigation Tabs */}
          <div className="flex items-center border-b border-[var(--color-border)] mb-8 overflow-x-auto">
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === "orders"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <Package className="w-4 h-4" /> Order History ({orders.length})
            </button>

            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex items-center gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === "addresses"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Addresses ({addresses.length})
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === "profile"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <UserIcon className="w-4 h-4" /> Account Info
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className={`flex items-center gap-2 py-3 px-4 sm:px-6 text-xs sm:text-sm font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 ${
                activeTab === "cart"
                  ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                  : "border-transparent text-gray-400 hover:text-white"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Synced Cart
            </button>
          </div>

          {/* TAB 1: ORDER HISTORY */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              {loadingOrders ? (
                <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs uppercase tracking-wider">Retrieving authenticated orders...</p>
                </div>
              ) : orders.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-[var(--color-border)] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-[var(--color-secondary)] text-[var(--color-primary)] mx-auto flex items-center justify-center mb-4">
                    <Package className="w-7 h-7" />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-white mb-2">No Orders Placed Yet</h3>
                  <p className="text-xs sm:text-sm text-gray-400 mb-6">
                    Your wild-harvested Himalayan wellness journey begins here. Experience authentic sea buckthorn pulp and berry oils.
                  </p>
                  <Button asChild className="bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs">
                    <Link to="/shop">Explore Catalog</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => {
                    const orderDate = new Date(order.created_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={order.id}
                        className="bg-[#0a0a0a] border border-[var(--color-border)] hover:border-[var(--color-border-gold)] rounded-2xl p-5 sm:p-6 transition-all shadow-lg"
                      >
                        {/* Top bar: Order No, Date, Status */}
                        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--color-border)]/60">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif font-bold text-white text-sm sm:text-base">
                                {order.order_number}
                              </span>
                              <span className="text-xs text-gray-500">• {orderDate}</span>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              Shipping to {order.city}, {order.state}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Payment Status Pill */}
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                order.payment_status === "paid"
                                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-500/40"
                                  : order.payment_status === "failed"
                                  ? "bg-red-950/60 text-red-400 border border-red-500/40"
                                  : "bg-amber-950/60 text-amber-400 border border-amber-500/40"
                              }`}
                            >
                              Payment: {order.payment_status}
                            </span>

                            {/* Order Fulfillment Status */}
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary-light)] border border-[var(--color-primary)]/30">
                              Status: {order.order_status}
                            </span>
                          </div>
                        </div>

                        {/* Line Items Preview */}
                        <div className="py-4 space-y-3">
                          {order.order_items && order.order_items.length > 0 ? (
                            order.order_items.map((item) => (
                              <div key={item.id} className="flex items-center justify-between text-xs sm:text-sm">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-black border border-[var(--color-border)] flex items-center justify-center text-[var(--color-primary)] shrink-0">
                                    <Sparkles className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <span className="text-white font-medium">{item.product_name}</span>
                                    <span className="text-gray-400 ml-2">x {item.quantity}</span>
                                  </div>
                                </div>
                                <span className="text-gray-300 font-semibold">
                                  ₹{Number(item.subtotal).toLocaleString("en-IN")}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">Item details secured on transaction record.</p>
                          )}
                        </div>

                        {/* Bottom Total & Receipt Action */}
                        <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]/60 text-xs sm:text-sm">
                          <div className="flex items-baseline gap-2">
                            <span className="text-gray-400">Total Paid:</span>
                            <span className="font-bold text-gold-gradient text-base sm:text-lg">
                              ₹{Number(order.total).toLocaleString("en-IN")}
                            </span>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedReceiptOrder(order)}
                            className="text-xs uppercase tracking-wider border-[var(--color-border-gold)] text-gray-300 hover:text-white"
                          >
                            <FileText className="w-3.5 h-3.5 mr-1 text-[var(--color-primary)]" />
                            View Receipt
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SAVED ADDRESSES */}
          {activeTab === "addresses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Delivery Destinations</h3>
                  <p className="text-xs text-gray-400">
                    Saved shipping destinations used for quick 1-click checkout.
                  </p>
                </div>
                <Button
                  onClick={() => handleOpenAddressModal()}
                  className="bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Add Address
                </Button>
              </div>

              {loadingAddresses ? (
                <div className="py-16 text-center text-gray-400 flex flex-col items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs uppercase tracking-wider">Loading saved addresses...</p>
                </div>
              ) : addresses.length === 0 ? (
                <div className="bg-[#0a0a0a] border border-[var(--color-border)] rounded-2xl p-8 sm:p-12 text-center max-w-lg mx-auto">
                  <MapPin className="w-10 h-10 text-[var(--color-primary)] mx-auto mb-3 opacity-80" />
                  <h4 className="font-serif text-base font-bold text-white mb-2">No Saved Addresses</h4>
                  <p className="text-xs text-gray-400 mb-6">
                    Add your home or office address to expedite your orders and delivery coordination.
                  </p>
                  <Button
                    onClick={() => handleOpenAddressModal()}
                    className="bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add First Address
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`bg-[#0a0a0a] border rounded-2xl p-5 sm:p-6 relative transition-all shadow-md ${
                        address.is_default
                          ? "border-[var(--color-primary)] shadow-[var(--color-primary)]/10"
                          : "border-[var(--color-border)] hover:border-gray-600"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--color-secondary)] text-[var(--color-primary)] border border-[var(--color-border-gold)]">
                            {address.label}
                          </span>
                          {address.is_default && (
                            <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                              DEFAULT
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenAddressModal(address)}
                            className="p-1.5 text-gray-400 hover:text-white rounded hover:bg-white/5"
                            title="Edit Address"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="p-1.5 text-gray-400 hover:text-red-400 rounded hover:bg-red-950/20"
                            title="Delete Address"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <h4 className="text-sm font-bold text-white mb-1">{address.name}</h4>
                      <p className="text-xs text-gray-400 mb-2">{address.phone}</p>
                      
                      <div className="text-xs text-gray-300 leading-relaxed mb-4">
                        <p>{address.address_line1}</p>
                        {address.address_line2 && <p>{address.address_line2}</p>}
                        <p>
                          {address.city}, {address.state} - {address.pincode}
                        </p>
                        <p>{address.country}</p>
                      </div>

                      {!address.is_default && (
                        <button
                          onClick={() => handleSetDefaultAddress(address.id)}
                          className="text-[11px] text-[var(--color-primary)] hover:underline uppercase tracking-wider font-semibold"
                        >
                          Set as Default Address
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: ACCOUNT & PROFILE INFO */}
          {activeTab === "profile" && (
            <div className="max-w-2xl bg-[#0a0a0a] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xl">
              <h3 className="font-serif text-lg font-bold text-white mb-1">Personal Profile Details</h3>
              <p className="text-xs text-gray-400 mb-6">
                Update your contact information linked to your orders and invoices.
              </p>

              {profileStatus && (
                <div
                  className={`mb-6 p-3.5 rounded-lg flex items-center gap-3 text-xs sm:text-sm ${
                    profileStatus.type === "success"
                      ? "bg-emerald-950/40 border border-emerald-500/50 text-emerald-200"
                      : "bg-red-950/40 border border-red-500/50 text-red-200"
                  }`}
                >
                  {profileStatus.type === "success" ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  )}
                  <span>{profileStatus.message}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm px-4 py-2.5 rounded-lg focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1.5 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black border border-[var(--color-border)] focus:border-[var(--color-primary)] text-white text-sm px-4 py-2.5 rounded-lg focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
                    Email Address (Account Identifier)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={user.email || ""}
                    className="w-full bg-black/50 border border-[var(--color-border)] text-gray-400 text-sm px-4 py-2.5 rounded-lg cursor-not-allowed"
                  />
                  <span className="text-[11px] text-gray-500 mt-1 block">
                    Email address is securely authenticated with Supabase.
                  </span>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={savingProfile}
                    className="bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs shadow-md"
                  >
                    {savingProfile ? "Saving..." : "Save Profile Details"}
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 4: SYNCED CART */}
          {activeTab === "cart" && (
            <div className="max-w-3xl bg-[#0a0a0a] border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-[var(--color-border)]">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white">Active Synced Cart</h3>
                  <p className="text-xs text-gray-400">
                    This cart is synced to your Supabase account across all devices.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-400 block">Subtotal</span>
                  <span className="text-lg font-serif font-black text-gold-gradient">
                    ₹{subtotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {cartItems.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <p className="text-sm text-gray-400 mb-4">Your synced shopping cart is currently empty.</p>
                  <Button asChild className="bg-gold-gradient text-black text-xs font-bold uppercase tracking-wider">
                    <Link to="/shop">Shop Now</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 p-3 bg-black/60 border border-[var(--color-border)] rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={item.images?.[0] || "/images/himroots-harvest-berries.jpg"}
                          alt={item.name}
                          className="w-12 h-12 rounded-lg object-cover border border-[var(--color-border)]"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{item.name}</h4>
                          <span className="text-xs text-gray-400">
                            Qty: {item.quantity} • ₹{item.price.toLocaleString("en-IN")} each
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-white">
                          ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 flex items-center justify-end gap-3">
                    <Button asChild variant="outline" size="sm">
                      <Link to="/cart">Modify Cart</Link>
                    </Button>
                    <Button asChild size="sm" className="bg-gold-gradient text-black font-bold uppercase tracking-wider">
                      <Link to="/checkout">Proceed to Checkout</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* MODAL: ADD / EDIT ADDRESS */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[var(--color-border-gold)] rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddressModal(false)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-xl font-bold text-white mb-2">
              {editingAddress ? "Edit Delivery Address" : "Add Delivery Address"}
            </h3>
            <p className="text-xs text-gray-400 mb-6">
              Saved destinations are encrypted and available across checkout sessions.
            </p>

            <form onSubmit={handleSaveAddress} className="space-y-4">
              <div className="grid grid-cols-3 gap-2 mb-2">
                {(["Home", "Office", "Other"] as const).map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => setAddressForm((prev) => ({ ...prev, label }))}
                    className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg border transition-all ${
                      addressForm.label === label
                        ? "bg-[var(--color-primary)] text-black border-[var(--color-primary)]"
                        : "bg-black text-gray-400 border-[var(--color-border)] hover:border-gray-500"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1 uppercase tracking-wider">
                    Recipient Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.name}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Full name"
                    className="w-full bg-black border border-[var(--color-border)] text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1 uppercase tracking-wider">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={addressForm.phone}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full bg-black border border-[var(--color-border)] text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1 uppercase tracking-wider">
                  Street Address (Line 1) *
                </label>
                <input
                  type="text"
                  required
                  value={addressForm.address_line1}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, address_line1: e.target.value }))}
                  placeholder="House/Flat No., Building, Street"
                  className="w-full bg-black border border-[var(--color-border)] text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-gray-300 mb-1 uppercase tracking-wider">
                  Landmark / Line 2 (Optional)
                </label>
                <input
                  type="text"
                  value={addressForm.address_line2 || ""}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, address_line2: e.target.value }))}
                  placeholder="Near Mall Road, Opposite Post Office"
                  className="w-full bg-black border border-[var(--color-border)] text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1 uppercase tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="Shimla"
                    className="w-full bg-black border border-[var(--color-border)] text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1 uppercase tracking-wider">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.state}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, state: e.target.value }))}
                    placeholder="Himachal Pradesh"
                    className="w-full bg-black border border-[var(--color-border)] text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-300 mb-1 uppercase tracking-wider">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressForm.pincode}
                    onChange={(e) => setAddressForm((prev) => ({ ...prev, pincode: e.target.value }))}
                    placeholder="171001"
                    className="w-full bg-black border border-[var(--color-border)] text-white text-xs px-3 py-2 rounded focus:outline-none focus:border-[var(--color-primary)]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={addressForm.is_default}
                  onChange={(e) => setAddressForm((prev) => ({ ...prev, is_default: e.target.checked }))}
                  className="rounded border-[var(--color-border)] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                />
                <label htmlFor="is_default" className="text-xs text-gray-300">
                  Set as default delivery address
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddressModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-gold-gradient text-black font-bold uppercase tracking-wider text-xs"
                >
                  {editingAddress ? "Save Changes" : "Save Address"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ORDER RECEIPT */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0f0f0f] border border-[var(--color-border-gold)] rounded-2xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedReceiptOrder(null)}
              className="absolute top-5 right-5 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center pb-6 border-b border-[var(--color-border)]">
              <h3 className="font-serif text-2xl font-bold text-gold-gradient">HIMROOTS</h3>
              <p className="text-[11px] uppercase tracking-widest text-gray-400 mt-0.5">
                High-Altitude Himalayan Botanicals
              </p>
              <div className="mt-3 inline-block px-3 py-1 rounded-full bg-black border border-[var(--color-border-gold)] text-xs text-gray-200">
                Receipt: {selectedReceiptOrder.order_number}
              </div>
            </div>

            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 text-xs gap-3">
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block">Customer</span>
                  <span className="text-white font-medium">{selectedReceiptOrder.customer_name}</span>
                  <span className="text-gray-400 block">{selectedReceiptOrder.email}</span>
                  <span className="text-gray-400 block">{selectedReceiptOrder.phone}</span>
                </div>
                <div>
                  <span className="text-gray-500 uppercase tracking-wider block">Delivering To</span>
                  <span className="text-gray-300 block">{selectedReceiptOrder.shipping_address}</span>
                  <span className="text-gray-300 block">
                    {selectedReceiptOrder.city}, {selectedReceiptOrder.state} {selectedReceiptOrder.pincode}
                  </span>
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-[var(--color-border)] rounded-xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-black/80 text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-2.5 px-3">Item</th>
                      <th className="py-2.5 px-3 text-center">Qty</th>
                      <th className="py-2.5 px-3 text-right">Price</th>
                      <th className="py-2.5 px-3 text-right">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-border)] text-gray-200">
                    {selectedReceiptOrder.order_items?.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 px-3 font-medium text-white">{item.product_name}</td>
                        <td className="py-2.5 px-3 text-center">{item.quantity}</td>
                        <td className="py-2.5 px-3 text-right">₹{Number(item.price).toLocaleString("en-IN")}</td>
                        <td className="py-2.5 px-3 text-right font-semibold">
                          ₹{Number(item.subtotal).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Financial Totals */}
              <div className="space-y-1.5 text-xs text-gray-300 pt-2 border-t border-[var(--color-border)]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{Number(selectedReceiptOrder.subtotal).toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>
                    {Number(selectedReceiptOrder.shipping_fee) === 0 ? "FREE" : `₹${selectedReceiptOrder.shipping_fee}`}
                  </span>
                </div>
                {Number(selectedReceiptOrder.discount) > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount</span>
                    <span>-₹{selectedReceiptOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-[var(--color-border)]">
                  <span>Total Amount Paid</span>
                  <span className="text-gold-gradient">
                    ₹{Number(selectedReceiptOrder.total).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              {selectedReceiptOrder.razorpay_payment_id && (
                <div className="bg-black/60 p-2.5 rounded text-[11px] text-gray-400 font-mono">
                  Razorpay Transaction Ref: {selectedReceiptOrder.razorpay_payment_id}
                </div>
              )}
            </div>

            <div className="pt-4 text-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.print()}
                className="text-xs uppercase tracking-wider"
              >
                Print / Save PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
