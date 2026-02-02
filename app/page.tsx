'use client';

import { useState } from 'react';
import { Plus, Trash2, Users, UtensilsCrossed, Truck, Languages, Share2, Download, Motorbike } from 'lucide-react';

type OrderType = 'dine-in' | 'delivery';
type Language = 'ms' | 'en';

interface FoodItem {
  id: string;
  name: string;
  price: number;
}

interface Person {
  id: string;
  name: string;
  items: FoodItem[];
}

interface SharedItem extends FoodItem {
  id: string;
}

interface TaxConfig {
  serviceCharge: {
    enabled: boolean;
    percentage: number;
  };
  serviceTax: {
    enabled: boolean;
    percentage: number;
  };
  deliveryFee: {
    enabled: boolean;
    amount: number;
  };
  processingCharge: {
    enabled: boolean;
    amount: number;
  };
  packagingCharge: {
    enabled: boolean;
    amount: number;
  };
  taxVat: {
    enabled: boolean;
    percentage: number;
  };
  discount: {
    enabled: boolean;
    amount: number;
  };
}

const translations = {
  ms: {
    title: 'Tong-Tong',
    dineIn: 'Makan',
    delivery: 'Tapau',
    titleBill: 'Tajuk',
    addPeople: 'Tambah Orang',
    entertitleBill: 'Rembayung/Grab',
    enterName: 'Masukkan nama...',
    add: 'Tambah',
    addItem: 'Tambah Item',
    sharedItems: 'Item Berkongsi',
    foodItem: 'Nama makanan...',
    sharedFoodItem: 'Item berkongsi...',
    personalItems: 'Item Peribadi:',
    sharedItemsSplit: 'Item Berkongsi (dibahagi):',
    subtotal: 'Subjumlah:',
    serviceCharge: 'Caj Servis',
    serviceTax: 'Cukai Perkhidmatan',
    deliveryFee: 'Yuran Penghantaran',
    processingCharge: 'Caj Pemprosesan',
    packagingCharge: 'Caj Pembungkusan',
    taxVat: 'Cukai/VAT',
    discount: 'Diskaun',
    deliveryFeeSplit: 'Yuran Penghantaran (dibahagi):',
    processingChargeSplit: 'Caj Pemprosesan (dibahagi):',
    packagingChargeSplit: 'Caj Pembungkusan (dibahagi):',
    taxVatCharge: 'Cukai/VAT:',
    discountAmount: 'Diskaun:',
    totalToPay: 'Jumlah Bayaran:',
    grandTotal: 'Ringkasan Jumlah Keseluruhan',
    grandTotalLabel: 'Jumlah Keseluruhan:',
    shareButton: 'Kongsi Bil',
    downloadButton: 'Muat Turun Imej',
    billSummary: 'Ringkasan Bil',
    paymentSummary: 'Ringkasan Bayaran',
  },
  en: {
    title: 'Tong-Tong',
    dineIn: 'Dine In',
    delivery: 'Delivery',
    titleBill: 'Title Bill',
    addPeople: 'Add People',
    entertitleBill: 'Rembayung/Grab',
    enterName: 'Enter person\'s name...',
    add: 'Add',
    addItem: 'Add Item',
    sharedItems: 'Shared Items',
    foodItem: 'Food item...',
    sharedFoodItem: 'Shared food item...',
    personalItems: 'Personal Items:',
    sharedItemsSplit: 'Shared Items (split):',
    subtotal: 'Subtotal:',
    serviceCharge: 'Service Charge',
    serviceTax: 'Service Tax',
    deliveryFee: 'Delivery Fee',
    processingCharge: 'Processing Charge',
    packagingCharge: 'Packaging Charge',
    taxVat: 'Tax/VAT',
    discount: 'Discount',
    deliveryFeeSplit: 'Delivery Fee (split):',
    processingChargeSplit: 'Processing Charge (split):',
    packagingChargeSplit: 'Packaging Charge (split):',
    taxVatCharge: 'Tax/VAT:',
    discountAmount: 'Discount:',
    totalToPay: 'Total to Pay:',
    grandTotal: 'Grand Total Summary',
    grandTotalLabel: 'Grand Total:',
    shareButton: 'Share Bill',
    downloadButton: 'Download Image',
    billSummary: 'Bill Summary',
    paymentSummary: 'Payment Summary',
  }
};

export default function SplitBillPage() {
  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [language, setLanguage] = useState<Language>('ms');
  const [people, setPeople] = useState<Person[]>([]);
  const [sharedItems, setSharedItems] = useState<SharedItem[]>([]);
  const [newPersonName, setNewPersonName] = useState('');
  const [billTitle, setBillTitle] = useState('');
  
  const [taxConfig, setTaxConfig] = useState<TaxConfig>({
    serviceCharge: {
      enabled: true,
      percentage: 10,
    },
    serviceTax: {
      enabled: true,
      percentage: 6,
    },
    deliveryFee: {
      enabled: true,
      amount: 5.0,
    },
    processingCharge: {
      enabled: false,
      amount: 2.0,
    },
    packagingCharge: {
      enabled: false,
      amount: 1.5,
    },
    taxVat: {
      enabled: false,
      percentage: 8,
    },
    discount: {
      enabled: false,
      amount: 0,
    },
  });

  const t = translations[language];

  // Tax and charge calculations
  const SERVICE_CHARGE = orderType === 'dine-in' && taxConfig.serviceCharge.enabled ? taxConfig.serviceCharge.percentage / 100 : 0;
  const SERVICE_TAX = taxConfig.serviceTax.enabled ? taxConfig.serviceTax.percentage / 100 : 0;
  const DELIVERY_FEE = orderType === 'delivery' && taxConfig.deliveryFee.enabled ? taxConfig.deliveryFee.amount : 0;
  const PROCESSING_CHARGE = orderType === 'delivery' && taxConfig.processingCharge.enabled ? taxConfig.processingCharge.amount : 0;
  const PACKAGING_CHARGE = orderType === 'delivery' && taxConfig.packagingCharge.enabled ? taxConfig.packagingCharge.amount : 0;
  const TAX_VAT = orderType === 'delivery' && taxConfig.taxVat.enabled ? taxConfig.taxVat.percentage / 100 : 0;
  const DISCOUNT = taxConfig.discount.enabled ? taxConfig.discount.amount : 0;

  const addPerson = () => {
    if (newPersonName.trim()) {
      setPeople([...people, { id: Date.now().toString(), name: newPersonName, items: [] }]);
      setNewPersonName('');
    }
  };

  const removePerson = (personId: string) => {
    setPeople(people.filter(p => p.id !== personId));
  };

  const addItemToPerson = (personId: string) => {
    setPeople(people.map(p => 
      p.id === personId 
        ? { ...p, items: [...p.items, { id: Date.now().toString(), name: '', price: 0 }] }
        : p
    ));
  };

  const updatePersonItem = (personId: string, itemId: string, field: 'name' | 'price', value: string | number) => {
    setPeople(people.map(p => 
      p.id === personId
        ? {
            ...p,
            items: p.items.map(item =>
              item.id === itemId ? { ...item, [field]: value } : item
            )
          }
        : p
    ));
  };

  const removePersonItem = (personId: string, itemId: string) => {
    setPeople(people.map(p =>
      p.id === personId
        ? { ...p, items: p.items.filter(item => item.id !== itemId) }
        : p
    ));
  };

  const addSharedItem = () => {
    setSharedItems([...sharedItems, { id: Date.now().toString(), name: '', price: 0 }]);
  };

  const updateSharedItem = (itemId: string, field: 'name' | 'price', value: string | number) => {
    setSharedItems(sharedItems.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    ));
  };

  const removeSharedItem = (itemId: string) => {
    setSharedItems(sharedItems.filter(item => item.id !== itemId));
  };

  const calculateBill = (person: Person) => {
    const personalTotal = person.items.reduce((sum, item) => sum + item.price, 0);
    const sharedTotal = sharedItems.reduce((sum, item) => sum + item.price, 0);
    const sharedPerPerson = people.length > 0 ? sharedTotal / people.length : 0;
    
    const subtotal = personalTotal + sharedPerPerson;
    const serviceCharge = subtotal * SERVICE_CHARGE;
    const afterServiceCharge = subtotal + serviceCharge;
    const serviceTax = afterServiceCharge * SERVICE_TAX;
    const deliveryShare = DELIVERY_FEE / (people.length || 1);
    const processingShare = PROCESSING_CHARGE / (people.length || 1);
    const packagingShare = PACKAGING_CHARGE / (people.length || 1);
    const taxVatAmount = afterServiceCharge * TAX_VAT;
    const discountShare = DISCOUNT / (people.length || 1);
    const total = afterServiceCharge + (orderType === 'delivery' ? 0 : serviceTax) + deliveryShare + processingShare + packagingShare + taxVatAmount - discountShare;

    return {
      personalTotal,
      sharedPerPerson,
      subtotal,
      serviceCharge,
      serviceTax,
      deliveryShare,
      processingShare,
      packagingShare,
      taxVatAmount,
      discountShare,
      total
    };
  };

  const grandTotal = () => {
    const itemsTotal = people.reduce((sum, person) => 
      sum + person.items.reduce((pSum, item) => pSum + item.price, 0), 0
    );
    const sharedTotal = sharedItems.reduce((sum, item) => sum + item.price, 0);
    const subtotal = itemsTotal + sharedTotal;
    const serviceCharge = subtotal * SERVICE_CHARGE;
    const afterServiceCharge = subtotal + serviceCharge;
    const serviceTax = afterServiceCharge * SERVICE_TAX;
    const taxVatAmount = afterServiceCharge * TAX_VAT;
    const total = afterServiceCharge + (orderType === 'delivery' ? 0 : serviceTax) + DELIVERY_FEE + PROCESSING_CHARGE + PACKAGING_CHARGE + taxVatAmount - DISCOUNT;

    return {
      subtotal,
      serviceCharge,
      serviceTax,
      deliveryFee: DELIVERY_FEE,
      processingCharge: PROCESSING_CHARGE,
      packagingCharge: PACKAGING_CHARGE,
      taxVatAmount,
      discount: DISCOUNT,
      total
    };
  };

  const totals = grandTotal();

  const generateShareImage = async () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas dimensions
    const padding = 40;
    const lineHeight = 45;
    const headerHeight = 100;
    const itemHeight = 60;
    const footerHeight = 80;
    
    const canvasWidth = 600;
    const contentHeight = headerHeight + (people.length * itemHeight) + footerHeight + (padding * 2);
    canvas.width = canvasWidth;
    canvas.height = contentHeight;

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, canvasWidth, contentHeight);
    gradient.addColorStop(0, '#FFF7ED'); // amber-50
    gradient.addColorStop(0.5, '#FFEDD5'); // orange-50
    gradient.addColorStop(1, '#FEE2E2'); // red-50
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasWidth, contentHeight);

    // Header
    ctx.fillStyle = '#EA580C'; // orange-600
    ctx.font = 'bold 48px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Tong-Tong', canvasWidth / 2, padding + 30);

    ctx.fillStyle = '#9CA3AF'; // gray-400
    ctx.font = '25px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(billTitle, canvasWidth / 2, padding + 70);

    // People and their totals
    let yPos = padding + headerHeight + 30;
    
    people.forEach((person) => {
      const bill = calculateBill(person);
      
      // Background for each person
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.strokeStyle = '#FB923C'; // orange-400
      ctx.lineWidth = 2;
      const boxY = yPos - 35;
      const boxHeight = 50;
      
      // Rounded rectangle
      const radius = 12;
      ctx.beginPath();
      ctx.moveTo(padding + radius, boxY);
      ctx.lineTo(canvasWidth - padding - radius, boxY);
      ctx.quadraticCurveTo(canvasWidth - padding, boxY, canvasWidth - padding, boxY + radius);
      ctx.lineTo(canvasWidth - padding, boxY + boxHeight - radius);
      ctx.quadraticCurveTo(canvasWidth - padding, boxY + boxHeight, canvasWidth - padding - radius, boxY + boxHeight);
      ctx.lineTo(padding + radius, boxY + boxHeight);
      ctx.quadraticCurveTo(padding, boxY + boxHeight, padding, boxY + boxHeight - radius);
      ctx.lineTo(padding, boxY + radius);
      ctx.quadraticCurveTo(padding, boxY, padding + radius, boxY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Person name
      ctx.fillStyle = '#1F2937'; // gray-800
      ctx.font = 'bold 24px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(person.name, padding + 20, yPos);

      // Amount
      ctx.fillStyle = '#EA580C'; // orange-600
      ctx.font = 'bold 28px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`RM ${bill.total.toFixed(2)}`, canvasWidth - padding - 20, yPos);

      yPos += itemHeight;
    });

    // Grand total
    yPos += 20;
    ctx.fillStyle = 'rgba(234, 88, 12, 0.1)'; // orange with transparency
    ctx.fillRect(padding, yPos - 40, canvasWidth - (padding * 2), 60);
    
    ctx.fillStyle = '#1F2937'; // gray-800
    ctx.font = 'bold 26px Arial, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(t.grandTotalLabel, padding + 20, yPos);

    ctx.fillStyle = '#DC2626'; // red-600
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`RM ${totals.total.toFixed(2)}`, canvasWidth - padding - 20, yPos);

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `tongtong-bill-${new Date().getTime()}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-20 left-10 w-64 h-64 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-20 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-40 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setLanguage(language === 'ms' ? 'en' : 'ms')}
              className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-md hover:shadow-lg transition-all border border-orange-200"
            >
              <Languages size={18} className="text-orange-500 sm:w-5 sm:h-5" />
              <span className="font-semibold text-sm sm:text-base text-gray-700">{language === 'ms' ? 'EN' : 'BM'}</span>
            </button>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-orange-600 bg-clip-text bg-gradient-to-r from-orange-600 to-red-600" style={{ fontFamily: "'Playfair Display', serif" }}>
            {t.title}
          </h1>
        </div>

        {/* Order Type Selection */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8">
          <button
            type="button"
            onClick={() => setOrderType('dine-in')}
            className={`flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
              orderType === 'dine-in'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
            }`}
          >
            <UtensilsCrossed size={20} className="sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">{t.dineIn}</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold transition-all transform hover:scale-105 ${
              orderType === 'delivery'
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl'
                : 'bg-white text-gray-700 hover:shadow-lg'
            }`}
          >
            <Motorbike size={20} className="sm:w-6 sm:h-6" />
            <span className="text-sm sm:text-base">{t.delivery}</span>
          </button>
        </div>

        {/* Add Title Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 border border-orange-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
            <Users className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
            {t.titleBill}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={billTitle}
              onChange={(e) => setBillTitle(e.target.value)}
              placeholder={t.entertitleBill}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Add Person Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 border border-orange-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800 flex items-center gap-2">
            <Users className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6" />
            {t.addPeople}
          </h2>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={newPersonName}
              onChange={(e) => setNewPersonName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addPerson()}
              placeholder={t.enterName}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={addPerson}
              className="px-6 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              <Plus size={18} className="sm:w-5 sm:h-5" />
              {t.add}
            </button>
          </div>
        </div>

        {/* People and Their Items */}
        <div className="grid gap-6 mb-8">
          {people.map((person) => {
            const bill = calculateBill(person);
            return (
              <div key={person.id} className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 border border-orange-100">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800">{person.name}</h3>
                  <button
                    type="button"
                    onClick={() => removePerson(person.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  {person.items.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updatePersonItem(person.id, item.id, 'name', e.target.value)}
                        placeholder={t.foodItem}
                        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
                      />
                      <div className="flex gap-2 sm:gap-3">
                        <div className="relative flex-1 sm:flex-none">
                          <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">RM</span>
                          <input
                            type="number"
                            step="0.01"
                            value={item.price || ''}
                            onChange={(e) => updatePersonItem(person.id, item.id, 'price', parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            className="w-full sm:w-28 md:w-32 pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePersonItem(person.id, item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                        >
                          <Trash2 size={18} className="sm:w-5 sm:h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addItemToPerson(person.id)}
                  className="w-full py-2 text-sm sm:text-base border-2 border-dashed border-orange-300 text-orange-500 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-semibold"
                >
                  <Plus size={18} className="sm:w-5 sm:h-5" />
                  {t.addItem}
                </button>

                {/* Person's Bill Summary */}
                <div className="mt-4 space-y-2 text-sm sm:text-base">
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-orange-600">
                    <span>{t.totalToPay}</span>
                    <span>RM {bill.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Shared Items Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 border border-orange-100">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-800">{t.sharedItems}</h2>
          
          <div className="space-y-3 mb-4">
            {sharedItems.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="text"
                  value={item.name}
                  onChange={(e) => updateSharedItem(item.id, 'name', e.target.value)}
                  placeholder={t.sharedFoodItem}
                  className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
                />
                <div className="flex gap-2 sm:gap-3">
                  <div className="relative flex-1 sm:flex-none">
                    <span className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm sm:text-base">RM</span>
                    <input
                      type="number"
                      step="0.01"
                      value={item.price || ''}
                      onChange={(e) => updateSharedItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                      onBlur={(e) => {
                        const parsed = parseFloat(e.target.value);
                        updateSharedItem(item.id, 'price', isNaN(parsed) ? 0 : parsed);
                      }}
                      placeholder="0.00"
                      className="w-full sm:w-28 md:w-32 pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 text-sm sm:text-base rounded-xl border-2 border-orange-200 focus:border-orange-400 focus:outline-none transition-colors"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSharedItem(item.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors flex-shrink-0"
                  >
                    <Trash2 size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSharedItem}
            className="w-full py-2 text-sm sm:text-base border-2 border-dashed border-orange-300 text-orange-500 rounded-xl hover:bg-orange-50 transition-colors flex items-center justify-center gap-2 font-semibold"
          >
            <Plus size={18} className="sm:w-5 sm:h-5" />
            {t.addItem}
          </button>
        </div>

        {/* Tax Configuration */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-4 sm:p-6 md:p-8 mb-8 border border-orange-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
            {/* Service Charge */}
            {orderType === 'dine-in' && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl">
                <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                  <input
                    type="checkbox"
                    id="serviceCharge"
                    checked={taxConfig.serviceCharge.enabled}
                    onChange={(e) => setTaxConfig({
                      ...taxConfig,
                      serviceCharge: { ...taxConfig.serviceCharge, enabled: e.target.checked }
                    })}
                    className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 flex-shrink-0"
                  />
                  <label htmlFor="serviceCharge" className="flex-1 font-semibold text-sm sm:text-base text-gray-700">
                    {t.serviceCharge}
                  </label>
                </div>
                <div className="flex items-center gap-2 ml-7 sm:ml-0">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={taxConfig.serviceCharge.percentage}
                    onChange={(e) => setTaxConfig({
                      ...taxConfig,
                      serviceCharge: { ...taxConfig.serviceCharge, percentage: parseFloat(e.target.value) || 0 }
                    })}
                    disabled={!taxConfig.serviceCharge.enabled}
                    className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                  />
                  <span className="text-gray-600 font-semibold text-sm sm:text-base">%</span>
                </div>
              </div>
            )}

            {/* Service Tax */}
            {orderType !== 'delivery' && (<div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl">
              <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <input
                  type="checkbox"
                  id="serviceTax"
                  checked={taxConfig.serviceTax.enabled}
                  onChange={(e) => setTaxConfig({
                    ...taxConfig,
                    serviceTax: { ...taxConfig.serviceTax, enabled: e.target.checked }
                  })}
                  className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 flex-shrink-0"
                />
                <label htmlFor="serviceTax" className="flex-1 font-semibold text-sm sm:text-base text-gray-700">
                  {t.serviceTax}
                </label>
              </div>
              <div className="flex items-center gap-2 ml-7 sm:ml-0">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={taxConfig.serviceTax.percentage}
                  onChange={(e) => setTaxConfig({
                    ...taxConfig,
                    serviceTax: { ...taxConfig.serviceTax, percentage: parseFloat(e.target.value) || 0 }
                  })}
                  disabled={!taxConfig.serviceTax.enabled}
                  className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                />
                <span className="text-gray-600 font-semibold text-sm sm:text-base">%</span>
              </div>
            </div>)}

            {/* Delivery Fee */}
            {orderType === 'delivery' && (
              <>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      id="deliveryFee"
                      checked={taxConfig.deliveryFee.enabled}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        deliveryFee: { ...taxConfig.deliveryFee, enabled: e.target.checked }
                      })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 flex-shrink-0"
                    />
                    <label htmlFor="deliveryFee" className="flex-1 font-semibold text-sm sm:text-base text-gray-700">
                      {t.deliveryFee}
                    </label>
                  </div>
                  <div className="flex items-center gap-2 ml-7 sm:ml-0">
                    <span className="text-gray-600 font-semibold text-sm sm:text-base">RM</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={taxConfig.deliveryFee.amount}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        deliveryFee: { ...taxConfig.deliveryFee, amount: parseFloat(e.target.value) || 0 }
                      })}
                      disabled={!taxConfig.deliveryFee.enabled}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>

                {/* Processing Charge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      id="processingCharge"
                      checked={taxConfig.processingCharge.enabled}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        processingCharge: { ...taxConfig.processingCharge, enabled: e.target.checked }
                      })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 flex-shrink-0"
                    />
                    <label htmlFor="processingCharge" className="flex-1 font-semibold text-sm sm:text-base text-gray-700">
                      {t.processingCharge}
                    </label>
                  </div>
                  <div className="flex items-center gap-2 ml-7 sm:ml-0">
                    <span className="text-gray-600 font-semibold text-sm sm:text-base">RM</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={taxConfig.processingCharge.amount}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        processingCharge: { ...taxConfig.processingCharge, amount: parseFloat(e.target.value) || 0 }
                      })}
                      disabled={!taxConfig.processingCharge.enabled}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>

                {/* Packaging Charge */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      id="packagingCharge"
                      checked={taxConfig.packagingCharge.enabled}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        packagingCharge: { ...taxConfig.packagingCharge, enabled: e.target.checked }
                      })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 flex-shrink-0"
                    />
                    <label htmlFor="packagingCharge" className="flex-1 font-semibold text-sm sm:text-base text-gray-700">
                      {t.packagingCharge}
                    </label>
                  </div>
                  <div className="flex items-center gap-2 ml-7 sm:ml-0">
                    <span className="text-gray-600 font-semibold text-sm sm:text-base">RM</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={taxConfig.packagingCharge.amount}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        packagingCharge: { ...taxConfig.packagingCharge, amount: parseFloat(e.target.value) || 0 }
                      })}
                      disabled={!taxConfig.packagingCharge.enabled}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>

                {/* Tax/VAT */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-orange-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      id="taxVat"
                      checked={taxConfig.taxVat.enabled}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        taxVat: { ...taxConfig.taxVat, enabled: e.target.checked }
                      })}
                      className="w-5 h-5 text-orange-500 rounded focus:ring-orange-400 flex-shrink-0"
                    />
                    <label htmlFor="taxVat" className="flex-1 font-semibold text-sm sm:text-base text-gray-700">
                      {t.taxVat}
                    </label>
                  </div>
                  <div className="flex items-center gap-2 ml-7 sm:ml-0">
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="100"
                      value={taxConfig.taxVat.percentage}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        taxVat: { ...taxConfig.taxVat, percentage: parseFloat(e.target.value) || 0 }
                      })}
                      disabled={!taxConfig.taxVat.enabled}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-lg border-2 border-orange-200 focus:border-orange-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                    <span className="text-gray-600 font-semibold text-sm sm:text-base">%</span>
                  </div>
                </div>

                {/* Discount */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
                    <input
                      type="checkbox"
                      id="discount"
                      checked={taxConfig.discount.enabled}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        discount: { ...taxConfig.discount, enabled: e.target.checked }
                      })}
                      className="w-5 h-5 text-green-500 rounded focus:ring-green-400 flex-shrink-0"
                    />
                    <label htmlFor="discount" className="flex-1 font-semibold text-sm sm:text-base text-gray-700">
                      {t.discount}
                    </label>
                  </div>
                  <div className="flex items-center gap-2 ml-7 sm:ml-0">
                    <span className="text-gray-600 font-semibold text-sm sm:text-base">RM</span>
                    <input
                      type="number"
                      step="0.50"
                      min="0"
                      value={taxConfig.discount.amount}
                      onChange={(e) => setTaxConfig({
                        ...taxConfig,
                        discount: { ...taxConfig.discount, amount: parseFloat(e.target.value) || 0 }
                      })}
                      disabled={!taxConfig.discount.enabled}
                      className="w-16 sm:w-20 px-2 sm:px-3 py-2 text-sm sm:text-base rounded-lg border-2 border-green-200 focus:border-green-400 focus:outline-none disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Grand Total */}
        {people.length > 0 && (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl shadow-2xl p-4 sm:p-6 md:p-8 text-white">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">{t.grandTotal}</h2>
            <div className="space-y-2 text-sm sm:text-base md:text-lg">
              <div className="flex justify-between">
                <span>{t.subtotal}</span>
                <span>RM {totals.subtotal.toFixed(2)}</span>
              </div>
              {totals.serviceCharge > 0 && (
                <div className="flex justify-between">
                  <span>{t.serviceCharge} ({taxConfig.serviceCharge.percentage}%):</span>
                  <span>RM {totals.serviceCharge.toFixed(2)}</span>
                </div>
              )}
              {orderType === 'dine-in' && totals.serviceTax > 0 && (
                <div className="flex justify-between">
                  <span>{t.serviceTax} ({taxConfig.serviceTax.percentage}%):</span>
                  <span>RM {totals.serviceTax.toFixed(2)}</span>
                </div>
              )}
              {totals.deliveryFee > 0 && (
                <div className="flex justify-between">
                  <span>{t.deliveryFee}:</span>
                  <span>RM {totals.deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {totals.processingCharge > 0 && (
                <div className="flex justify-between">
                  <span>{t.processingCharge}:</span>
                  <span>RM {totals.processingCharge.toFixed(2)}</span>
                </div>
              )}
              {totals.packagingCharge > 0 && (
                <div className="flex justify-between">
                  <span>{t.packagingCharge}:</span>
                  <span>RM {totals.packagingCharge.toFixed(2)}</span>
                </div>
              )}
              {totals.taxVatAmount > 0 && (
                <div className="flex justify-between">
                  <span>{t.taxVat} ({taxConfig.taxVat.percentage}%):</span>
                  <span>RM {totals.taxVatAmount.toFixed(2)}</span>
                </div>
              )}
              {totals.discount > 0 && (
                <div className="flex justify-between text-green-200">
                  <span>{t.discount}:</span>
                  <span>- RM {totals.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg sm:text-xl md:text-2xl font-bold pt-4 border-t-2 border-white/30">
                <span>{t.grandTotalLabel}</span>
                <span>RM {totals.total.toFixed(2)}</span>
              </div>
            </div>
            
            {/* Share Button */}
            <button
              type="button"
              onClick={generateShareImage}
              className="w-full mt-6 py-3 sm:py-4 bg-white text-orange-600 rounded-2xl font-bold hover:bg-orange-50 transition-all transform hover:scale-105 flex items-center justify-center gap-2 text-sm sm:text-base shadow-lg"
            >
              <Download size={20} className="sm:w-5 sm:h-5" />
              {t.downloadButton}
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap');

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}