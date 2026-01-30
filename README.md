# BahagiBill - Malaysian Bill Splitting App

A beautiful Next.js application for splitting bills the Malaysian way! Perfect for restaurants, food delivery, and group dining with proper Malaysian tax calculations.

## Features

- ✨ **Two Order Types**: Dine-in and Delivery
- 👥 **Multiple People**: Add as many people as needed
- 🍽️ **Personal Items**: Each person can have their own food items
- 🤝 **Shared Items**: Items that are split equally among all people
- 💰 **Malaysian Tax Calculations**:
  - 6% Service Tax (SST)
  - 10% Service Charge (dine-in only)
  - Delivery fee (delivery only)
- 📊 **Individual & Grand Totals**: See what each person owes and the overall bill
- 🎨 **Beautiful UI**: Distinctive Malaysian-inspired design with warm gradients

## Tax Calculations

### Dine-In
1. Subtotal (personal items + shared items split)
2. + 10% Service Charge
3. + 6% Service Tax (calculated on subtotal + service charge)
4. = Total

### Delivery
1. Subtotal (personal items + shared items split)
2. + 6% Service Tax (calculated on subtotal)
3. + Delivery Fee (split equally, default RM 5)
4. = Total

## Setup Instructions

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
bahagibill/
├── app/
│   ├── page.tsx          # Main split bill component
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles with Tailwind
├── public/               # Static assets (if needed)
├── next.config.js        # Next.js configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

## Customization

### Modify Tax Rates

Edit the constants in `app/page.tsx`:

```typescript
const SERVICE_TAX = 0.06;        // 6% Service Tax
const SERVICE_CHARGE = 0.10;     // 10% Service Charge (dine-in)
const DELIVERY_FEE = 5.00;       // RM 5 delivery fee
```

### Change Colors

The app uses a warm orange-red gradient theme. Modify the Tailwind classes in `app/page.tsx` to change colors:

- `from-orange-500 to-red-500` - Main gradient
- `bg-amber-50 via-orange-50 to-red-50` - Background gradient

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **Vercel** - Deployment

## License

MIT License - feel free to use this for your own projects!

## Support

If you encounter any issues, please check:
1. Node.js version (v18 or higher recommended)
2. All dependencies are installed
3. Build commands complete successfully

For Vercel deployment issues, refer to [Vercel Documentation](https://vercel.com/docs)