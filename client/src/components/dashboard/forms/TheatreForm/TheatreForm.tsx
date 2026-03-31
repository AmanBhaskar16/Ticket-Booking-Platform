import { useState } from "react";
import Modal             from "../../../common/Modal/Modal.tsx";
import MultiImageUpload from "../../../common/MultiImageUpload/MultiImageUpload.tsx";
import { theatresApi } from "../../../../api/index.api.ts";
import { showToast }  from "../../../common/Toast/toast.ts";
import type { Theatre, CreateTheatrePayload } from "../../../../types/movie.types.ts";

interface TheatreFormProps {
  data:    Theatre | null;
  onClose: () => void;
  onSave:  () => void;
}

const STATE_OPTIONS   = ["Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal","Delhi","Jammu & Kashmir"];
const CITY_OPTIONS    = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Ahmedabad","Jaipur","Lucknow","Patna","Chandigarh","Indore","Bhopal","Surat","Nagpur","Vadodara","Visakhapatnam","Coimbatore","Kochi"];
const AMENITY_OPTIONS = ["Parking","Food Court","IMAX Screen","4DX Hall","Dolby Atmos","Wheelchair Access","Online Booking","M-Ticket","Water Dispenser","ATM","Lounge","Kids Zone"];

type Form = CreateTheatrePayload;

const BLANK: Form = {
  name: "", description: "", city: "", state: "",
  pincode: 0, address: "", totalScreens: 1, amenities: [], images: [],
};

export default function TheatreForm({ data, onClose, onSave }: TheatreFormProps) {
  const isEdit = !!data;

  const [form, setForm] = useState<Form>(data ? {
    name:         data.name,
    description:  data.description ?? "",
    city:         data.city,
    state:        data.state        ?? "",
    pincode:      data.pincode,
    address:      data.address,
    totalScreens: data.totalScreens ?? 1,
    amenities:    data.amenities    ?? [],
    images:       data.images       ?? [],
  } : { ...BLANK });

  const [saving, setSaving] = useState(false);

  const set = <K extends keyof Form>(k: K, v: Form[K]) =>
    setForm(p => ({ ...p, [k]: v }));

  const toggleAmenity = (a: string) =>
    set("amenities", form.amenities.includes(a)
      ? form.amenities.filter(x => x !== a)
      : [...form.amenities, a]);

  const validate = (): string | null => {
    if (!form.name.trim()    || form.name.length    < 5)  return "Name must be at least 5 characters";
    if (!form.city.trim())                                  return "City is required";
    if (!form.state.trim())                                 return "State is required";
    if (!form.address.trim() || form.address.length < 5)   return "Address must be at least 5 characters";
    if (!form.pincode || String(form.pincode).length !== 6) return "Pincode must be 6 digits";
    if (form.totalScreens < 1)                              return "Must have at least 1 screen";
    return null;
  };

  const handleSubmit = async () => {
    const err = validate();
    if (err) { showToast(err, "error"); return; }
    setSaving(true);
    try {
      if (isEdit) await theatresApi.update(data!._id, form);
      else        await theatresApi.create(form);
      showToast(`Theatre ${isEdit ? "updated" : "created"} successfully`);
      onSave();
    } catch (e) {
      showToast(e instanceof Error ? e.message : "Failed to save", "error");
    } finally { setSaving(false); }
  };

  return (
    <Modal
      title={isEdit ? "EDIT THEATRE" : "ADD THEATRE"}
      onClose={onClose}
      maxWidth={600}
      footer={
        <>
          <button className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Theatre"}
          </button>
        </>
      }
    >
      {/* Basic */}
      <p className="form-section-label">BASIC INFO</p>
      <div className="form-group">
        <label className="form-label">Theatre Name *</label>
        <input className="form-input" value={form.name}
          onChange={e => set("name", e.target.value)}
          placeholder="e.g. PVR Cinemas" />
      </div>
      <div className="form-group">
        <label className="form-label">Description</label>
        <textarea className="form-input" rows={2} value={form.description}
          onChange={e => set("description", e.target.value)}
          placeholder="Optional tagline or description" />
      </div>

      {/* Location */}
      <p className="form-section-label">LOCATION</p>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">City *</label>
          <select className="form-input" value={form.city}
            onChange={e => set("city", e.target.value)}>
            <option value="">Select City</option>
            {CITY_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">State *</label>
          <select className="form-input" value={form.state}
            onChange={e => set("state", e.target.value)}>
            <option value="">Select State</option>
            {STATE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Pincode *</label>
          <input className="form-input" type="number"
            value={form.pincode || ""}
            onChange={e => set("pincode", Number(e.target.value))}
            placeholder="6-digit pincode" />
        </div>
        <div className="form-group">
          <label className="form-label">Total Screens *</label>
          <input className="form-input" type="number" min={1} max={20}
            value={form.totalScreens}
            onChange={e => set("totalScreens", Number(e.target.value))} />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Address *</label>
        <input className="form-input" value={form.address}
          onChange={e => set("address", e.target.value)}
          placeholder="Full street address" />
      </div>

      {/* Amenities */}
      <p className="form-section-label">AMENITIES</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {AMENITY_OPTIONS.map(a => (
          <button key={a} type="button"
            className={`amenity-toggle ${form.amenities.includes(a) ? "active" : ""}`}
            onClick={() => toggleAmenity(a)}>
            {a}
          </button>
        ))}
      </div>

      {/* Images */}
      <p className="form-section-label">PHOTOS</p>
      <MultiImageUpload
        label="Theatre Images"
        images={form.images}
        onChange={v => set("images", v)}
        folder="cineverse/theatres"
        optional
      />
    </Modal>
  );
}