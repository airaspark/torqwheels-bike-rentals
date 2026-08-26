import React, { useState, useEffect } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Bike as BikeIcon,
  Tag,
  Star,
  MapPin,
  X,
} from 'lucide-react';
import { BikeService } from '../../services/bike.service';
import { LocationService } from '../../services/location.service';
import { Bike, BikeCategory, LocationHub } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';

export const AdminBikesPage: React.FC = () => {
  const [bikes, setBikes] = useState<Bike[]>([]);
  const [locations, setLocations] = useState<LocationHub[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBike, setEditingBike] = useState<Bike | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    model: '',
    category: 'cruiser' as BikeCategory,
    engineCC: 350,
    fuelType: 'Petrol',
    transmission: 'Manual',
    mileage: '35 kmpl',
    seatingCapacity: 2,
    year: 2024,
    pricePerDay: 999,
    securityDeposit: 1500,
    locationId: 'loc-1',
    available: true,
    tag: 'Popular',
    description: '',
    images: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
    features: 'Front & Rear ABS, Digital Console, USB Charging Port, Fuel Injection',
  });

  const loadBikes = async () => {
    setLoading(true);
    try {
      const [bList, lList] = await Promise.all([
        BikeService.getAllBikes(),
        LocationService.getAllLocations(),
      ]);
      setBikes(bList);
      setLocations(lList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    loadBikes();
  }, []);

  const handleOpenAdd = () => {
    setEditingBike(null);
    setFormData({
      name: '',
      brand: 'Royal Enfield',
      model: 'Classic 350 Stealth',
      category: 'cruiser',
      engineCC: 349,
      fuelType: 'Petrol',
      transmission: 'Manual',
      mileage: '35 kmpl',
      seatingCapacity: 2,
      year: 2024,
      pricePerDay: 899,
      securityDeposit: 1500,
      locationId: locations[0]?.id || 'loc-1',
      available: true,
      tag: 'New Addition',
      description: 'Well-maintained, smooth ride with dual-channel ABS and comfortable touring seat.',
      images: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80',
      features: 'Front & Rear ABS, Digital Console, USB Charging Port, Dual Disc Brakes',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (bike: Bike) => {
    setEditingBike(bike);
    setFormData({
      name: bike.name,
      brand: bike.brand,
      model: bike.model,
      category: bike.category,
      engineCC: bike.engineCC,
      fuelType: bike.fuelType,
      transmission: bike.transmission,
      mileage: bike.mileage,
      seatingCapacity: bike.seatingCapacity,
      year: bike.year,
      pricePerDay: bike.pricePerDay,
      securityDeposit: bike.securityDeposit,
      locationId: bike.locationId,
      available: bike.available,
      tag: bike.tag || '',
      description: bike.description,
      images: bike.images.join(', '),
      features: bike.features.join(', '),
    });
    setIsModalOpen(true);
  };

  const handleToggleAvailability = async (bike: Bike) => {
    await BikeService.toggleAvailability(bike.id, !bike.available);
    loadBikes();
  };

  const handleDelete = async (bikeId: string) => {
    if (window.confirm('Are you sure you want to remove this bike from the fleet catalog?')) {
      await BikeService.deleteBike(bikeId);
      loadBikes();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const loc = locations.find((l) => l.id === formData.locationId);
    const imageArray = formData.images
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const featureArray = formData.features
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: formData.name,
      brand: formData.brand,
      model: formData.model,
      category: formData.category,
      engineCC: Number(formData.engineCC),
      fuelType: formData.fuelType,
      transmission: formData.transmission,
      mileage: formData.mileage,
      seatingCapacity: Number(formData.seatingCapacity),
      year: Number(formData.year),
      pricePerDay: Number(formData.pricePerDay),
      securityDeposit: Number(formData.securityDeposit),
      locationId: formData.locationId,
      locationName: loc ? `${loc.city} - ${loc.name}` : 'Indiranagar Hub',
      available: formData.available,
      tag: formData.tag || undefined,
      description: formData.description,
      images: imageArray.length > 0 ? imageArray : ['https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80'],
      features: featureArray,
      rules: [
        'Valid Driving Licence mandatory at pickup',
        'Helmets are mandatory for rider and pillion',
        'Fuel provided level-to-level',
        'Speed limit strictly capped at 90 km/h on national highways',
      ],
      rating: 4.9,
      reviewCount: 18,
    };

    if (editingBike) {
      await BikeService.updateBike(editingBike.id, payload);
    } else {
      await BikeService.createBike(payload);
    }

    setIsModalOpen(false);
    loadBikes();
  };

  const filteredBikes = bikes.filter((b) => {
    const matchesSearch =
      b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.locationName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || b.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Fleet Operations
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 mt-1">
            Motorcycles & Scooters Catalog
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Add new inventory, adjust pricing, toggle station availability, and edit specifications.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          variant="primary"
          size="md"
          leftIcon={<Plus className="w-4 h-4" />}
          className="font-bold shadow-md"
        >
          Add New Motorcycle
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search bike name, brand, hub..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-medium text-slate-900 focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1">
          {['all', 'cruiser', 'sports', 'adventure', 'scooter', 'electric_scooter', 'commuter'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors capitalize cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Fleet' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Fleet Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Motorcycle</th>
                <th className="py-3 px-4">Specs</th>
                <th className="py-3 px-4">Station Hub</th>
                <th className="py-3 px-4">Tariff / Day</th>
                <th className="py-3 px-4">Deposit</th>
                <th className="py-3 px-4 text-center">Availability</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBikes.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.images[0]}
                        alt={b.name}
                        className="w-14 h-11 object-cover rounded-xl bg-slate-900 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase text-amber-600">
                          {b.brand}
                        </span>
                        <p className="font-bold text-slate-900 text-sm">{b.name}</p>
                        <p className="text-slate-400 text-[10px]">{b.category.toUpperCase()}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-700">
                    <p className="font-semibold text-slate-900">{b.fuelType === 'Electric' ? 'EV Powertrain' : `${b.engineCC}cc`}</p>
                    <p className="text-slate-500 text-[10px]">{b.transmission} • {b.mileage}</p>
                  </td>

                  <td className="py-3 px-4 text-slate-700 font-medium">
                    <p className="text-slate-900 font-semibold">{b.locationName}</p>
                  </td>

                  <td className="py-3 px-4 font-black text-slate-950 text-sm">
                    ₹{b.pricePerDay}
                  </td>

                  <td className="py-3 px-4 text-emerald-700 font-bold">
                    ₹{b.securityDeposit}
                  </td>

                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleAvailability(b)}
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                        b.available
                          ? 'bg-emerald-100 text-emerald-900 hover:bg-emerald-200'
                          : 'bg-rose-100 text-rose-900 hover:bg-rose-200'
                      }`}
                    >
                      {b.available ? <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-rose-600" />}
                      <span>{b.available ? 'Available' : 'Booked'}</span>
                    </button>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEdit(b)}
                        className="p-1.5 text-slate-600 hover:text-amber-600 bg-slate-100 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Edit bike specs"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="p-1.5 text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete bike"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingBike ? `Edit: ${editingBike.name}` : 'Add New Motorcycle to Fleet'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Bike Model Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Royal Enfield Hunter 350"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Brand *</label>
              <input
                type="text"
                required
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g. Royal Enfield / Yamaha / Ather"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              >
                <option value="cruiser">Cruiser</option>
                <option value="sports">Sports</option>
                <option value="adventure">Adventure</option>
                <option value="scooter">Scooter</option>
                <option value="electric_scooter">Electric Scooter</option>
                <option value="commuter">Commuter</option>
              </select>
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Engine CC / Power</label>
              <input
                type="number"
                value={formData.engineCC}
                onChange={(e) => setFormData({ ...formData, engineCC: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Station Hub *</label>
              <select
                value={formData.locationId}
                onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.city} - {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Price Per Day (₹) *</label>
              <input
                type="number"
                required
                value={formData.pricePerDay}
                onChange={(e) => setFormData({ ...formData, pricePerDay: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Security Deposit (₹) *</label>
              <input
                type="number"
                required
                value={formData.securityDeposit}
                onChange={(e) => setFormData({ ...formData, securityDeposit: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold uppercase text-slate-500 mb-1">Tag / Label</label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                placeholder="e.g. Popular, Top Touring"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 mb-1">Photo Image URL *</label>
            <input
              type="url"
              required
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 mb-1">Features (Comma Separated)</label>
            <input
              type="text"
              value={formData.features}
              onChange={(e) => setFormData({ ...formData, features: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
            />
          </div>

          <div>
            <label className="block font-bold uppercase text-slate-500 mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-medium text-slate-900"
            />
          </div>

          <div className="pt-3 border-t flex items-center justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" className="font-bold">
              {editingBike ? 'Save Changes' : 'Create Motorcycle'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
