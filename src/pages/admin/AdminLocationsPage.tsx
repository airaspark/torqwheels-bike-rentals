import React, { useState, useEffect } from 'react';
import { MapPin, Plus, Edit2, Phone, Clock, Bike, Check, X } from 'lucide-react';
import { LocationService } from '../../services/location.service';
import { LocationHub } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const AdminLocationsPage: React.FC = () => {
  const [locations, setLocations] = useState<LocationHub[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLoc, setEditingLoc] = useState<LocationHub | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    city: 'Mysuru',
    address: '',
    contactPhone: '+91 80 4912 8800',
    openingHours: '07:00 AM – 10:00 PM',
    bikeCount: 15,
  });

  const loadLocations = async () => {
    setLoading(true);
    try {
      const data = await LocationService.getAllLocations();
      setLocations(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadLocations();
  }, []);

  const handleOpenAdd = () => {
    setEditingLoc(null);
    setFormData({
      name: '',
      city: 'Bengaluru',
      address: '',
      contactPhone: '+91 80 4912 8800',
      openingHours: '07:00 AM – 10:00 PM',
      bikeCount: 12,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (loc: LocationHub) => {
    setEditingLoc(loc);
    setFormData({
      name: loc.name,
      city: loc.city,
      address: loc.address,
      contactPhone: loc.contactPhone,
      openingHours: loc.openingHours,
      bikeCount: loc.bikeCount,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLoc) {
      await LocationService.updateLocation(editingLoc.id, formData);
    } else {
      await LocationService.createLocation({
        ...formData,
        active: true,
      });
    }
    setIsModalOpen(false);
    loadLocations();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Station Network
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Hubs & Pickup Stations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage station addresses, operating hours, phone helplines, and fleet allocations.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold shadow-md"
        >
          Add New Station
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((loc) => (
          <div
            key={loc.id}
            className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg">
                  {loc.city}
                </span>
                <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                  {loc.bikeCount} Bikes
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-950">{loc.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{loc.address}</p>

              <div className="space-y-1 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{loc.openingHours}</span>
                </p>
                <p className="flex items-center gap-1.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{loc.contactPhone}</span>
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <Button
                onClick={() => handleOpenEdit(loc)}
                variant="outline"
                size="sm"
                leftIcon={<Edit2 className="w-3.5 h-3.5" />}
                className="text-xs"
              >
                Edit Station
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLoc ? `Edit: ${editingLoc.name}` : 'Add New Hub Station'}
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold uppercase text-slate-500 mb-1">Hub Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Koramangala Hub"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">City *</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Stationed Bikes</label>
              <input
                type="number"
                value={formData.bikeCount}
                onChange={(e) => setFormData({ ...formData, bikeCount: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 mb-1">Full Street Address *</label>
            <textarea
              rows={2}
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Operating Hours</label>
              <input
                type="text"
                value={formData.openingHours}
                onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Contact Phone</label>
              <input
                type="text"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="pt-3 border-t flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              {editingLoc ? 'Save Changes' : 'Create Station'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
