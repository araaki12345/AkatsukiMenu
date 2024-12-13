'use client'

import { MenuItem } from '@/types/menu';
import { Coffee, Utensils, X } from 'lucide-react';

interface MenuDetailModalProps {
    menu: MenuItem;
    date: Date;
    onClose: () => void;
}

export const MenuDetailModal = ({ menu, date, onClose }: MenuDetailModalProps) => {
    const formatDate = (date: Date) => {
        return date.toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
        });
    };

    const MenuSection = ({ icon, title, items }: { icon: React.ReactNode; title: string; items: string[] }) => (
        <div className="rounded-lg bg-gray-50 p-4">
            <div className="flex items-center gap-2 mb-3">
                {icon}
                <h3 className="font-bold text-lg text-gray-700">{title}</h3>
            </div>
            <div className="grid gap-2">
                {items.map((item, index) => (
                    <div
                        key={index}
                        className="px-3 py-2 bg-white rounded-md text-gray-700"
                    >
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );

    const processMenuItems = (menuText: string) => {
        return menuText
            // 改行とスペースで分割
            .split(/[\n\s]/)
            // 空の要素を削除
            .filter(item => item.trim().length > 0)
            // 全角スペースを削除
            .map(item => item.replace(/　/g, ''));
    };

    return (
        <>
            <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl z-50 max-w-2xl mx-auto">
                {/* ヘッダー */}
                <div className="flex items-start justify-between p-4 border-b">
                    <div>
                        <h2 className="text-xl font-bold text-primary">献立詳細</h2>
                        <p className="text-sm text-gray-600 mt-1">{formatDate(date)}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* コンテンツ */}
                <div className="p-4 space-y-4">
                    <MenuSection
                        icon={<Coffee className="w-5 h-5 text-primary" />}
                        title="朝食"
                        items={processMenuItems(menu.breakfast)}
                    />

                    <MenuSection
                        icon={<Utensils className="w-5 h-5 text-primary" />}
                        title="夕食"
                        items={processMenuItems(menu.dinner)}
                    />
                </div>Ï
            </div>
        </>
    );
};