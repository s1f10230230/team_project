'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface InquiryFormProps {
  propertyId: string;
  propertyTitle: string;
}

export function ListingInquiryForm({ propertyId, propertyTitle }: InquiryFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    type: 'viewing',
    preferredDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 実際の実装ではAPIに送信
    console.log('問い合わせ送信:', {
      propertyId,
      ...formData,
    });

    // LocalStorageに保存（デモ用）
    const inquiries = JSON.parse(localStorage.getItem('inquiries') || '[]');
    inquiries.push({
      propertyId,
      propertyTitle,
      ...formData,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('inquiries', JSON.stringify(inquiries));

    alert('お問い合わせありがとうございます。担当者より連絡させていただきます。');

    // フォームをリセット
    setFormData({
      name: '',
      email: '',
      phone: '',
      message: '',
      type: 'viewing',
      preferredDate: '',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>お問い合わせ・内見予約</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              お問い合わせ種別 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            >
              <option value="viewing">内見希望</option>
              <option value="consultation">相談希望</option>
              <option value="information">資料請求</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">電話番号</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>

          {formData.type === 'viewing' && (
            <div>
              <label className="block text-sm font-medium mb-1">希望日時</label>
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) =>
                  setFormData({ ...formData, preferredDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              メッセージ・ご要望
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              rows={4}
              placeholder="ご質問やご要望があればご記入ください"
            />
          </div>

          <Button type="submit" className="w-full">
            送信する
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}