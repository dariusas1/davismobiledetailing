'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FaHome,
  FaCalendarAlt,
  FaUsers,
  FaImages,
  FaBox,
  FaComments,
  FaGift,
  FaStar,
  FaQuestionCircle,
  FaCog,
  FaChartBar,
  FaEdit,
  FaBell
} from 'react-icons/fa';

const menuItems = [
  { href: '/admin', icon: FaHome, label: 'Dashboard' },
  { href: '/admin/bookings', icon: FaCalendarAlt, label: 'Bookings' },
  { href: '/admin/customers', icon: FaUsers, label: 'Customers' },
  { href: '/admin/content', icon: FaEdit, label: 'Content Management' },
  { href: '/admin/services', icon: FaBox, label: 'Services & Pricing' },
  { href: '/admin/gallery', icon: FaImages, label: 'Gallery' },
  { href: '/admin/reviews', icon: FaComments, label: 'Reviews' },
  { href: '/admin/gift-cards', icon: FaGift, label: 'Gift Cards' },
  { href: '/admin/loyalty', icon: FaStar, label: 'Loyalty Program' },
  { href: '/admin/faq', icon: FaQuestionCircle, label: 'FAQ Management' },
  { href: '/admin/notifications', icon: FaBell, label: 'Notifications' },
  { href: '/admin/analytics', icon: FaChartBar, label: 'Analytics' },
  { href: '/admin/settings', icon: FaCog, label: 'Settings' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`bg-white shadow-lg ${isCollapsed ? 'w-20' : 'w-64'} transition-all duration-300`}>
      <div className="h-screen sticky top-0 overflow-y-auto">
        <div className="p-4 border-b">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="w-full text-gray-500 hover:text-gray-900"
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-gold text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className={`text-xl ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
} 