import { type ChangeEvent, type FormEvent, useMemo, useState } from "react";
import api from "../services/api";
import type { CreateOrderRequest, Order } from "../types/order";

const initialFormData: CreateOrderRequest = {
  customerName: "",
  phone: "",
  addressLine1: "",
  city: "",
  state: "",
  zip: "",
  mumColor: "",
  quantity: 1,
};

const mumColors = ["Yellow", "Red", "White", "Purple", "Orange", "Pink"];

function estimatePrice(quantity: number): number {
  const bundles = Math.floor(quantity / 3);
  const remainder = quantity % 3;
  return bundles * 25 + remainder * 10;
}

export default function NewOrderPage() {
  const [formData, setFormData] = useState<CreateOrderRequest>(initialFormData);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const estimatedPrice = useMemo(
    () => estimatePrice(formData.quantity),
    [formData.quantity],
  );

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "quantity") {
        return { ...prev, quantity: Number(value) };
      }

      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await api.post<Order>("/orders", formData);
      setMessage(
        `Order created successfully for ${response.data.customerName}. Total price: $${response.data.totalPrice}`,
      );
      setFormData(initialFormData);
    } catch (err) {
      console.error(err);
      setError("Failed to create order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            New Mum Order
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Enter customer information to create a new order.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Customer Name
                </label>
                <input
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Jane Doe"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Phone
                </label>
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="555-123-4567"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Mum Color
                </label>
                <select
                  name="mumColor"
                  value={formData.mumColor}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2.5 outline-none transition focus:border-slate-500"
                  required
                >
                  <option value="">Select a color</option>
                  {mumColors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Address
                </label>
                <input
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="12 Main St"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  City
                </label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Boston"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  State
                </label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="MA"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  ZIP
                </label>
                <input
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  placeholder="02110"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 outline-none transition focus:border-slate-500"
                  required
                />
              </div>
            </div>

            <div className="rounded-xl bg-slate-100 p-4">
              <p className="text-sm text-slate-600">Estimated price</p>
              <p className="text-2xl font-semibold text-slate-900">
                ${estimatedPrice}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Pricing: $10 each or 3 for $25
              </p>
            </div>

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Submitting..." : "Submit Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
