window.FINDIT_CONFIG = {
  SUPABASE_URL: 'https://your-project-id.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  STORAGE_BUCKET: 'item-photos',
  APP_NAME: 'FINDIT',
  DEMO_MODE: true,
  SITE_URL: 'http://localhost:8000',
  DEMO_ITEMS: [
    {
      id: 'lost-1',
      user_id: 'demo-user-1',
      report_type: 'Lost',
      item_name: 'Black Wallet',
      category: 'Wallets and purses',
      colour: 'Black',
      description: 'Leather wallet with a faded stitched seam and a cracked card slot.',
      location: 'Library',
      report_date: '2026-11-02',
      image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
      status: 'Active',
      created_at: '2026-11-02T09:15:00Z'
    },
    {
      id: 'found-1',
      user_id: 'demo-user-2',
      report_type: 'Found',
      item_name: 'Black Wallet',
      category: 'Wallets and purses',
      colour: 'Black',
      description: 'Found near the student study lounge, dark leather wallet with card slots.',
      location: 'Study Lounge',
      report_date: '2026-11-03',
      image_url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80',
      status: 'Active',
      created_at: '2026-11-03T11:40:00Z'
    },
    {
      id: 'lost-2',
      user_id: 'demo-user-3',
      report_type: 'Lost',
      item_name: 'Blue Water Bottle',
      category: 'Accessories',
      colour: 'Blue',
      description: 'Insulated bottle with a small sticker of a mountain logo.',
      location: 'Engineering Block',
      report_date: '2026-11-05',
      image_url: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
      status: 'Active',
      created_at: '2026-11-05T08:20:00Z'
    },
    {
      id: 'found-2',
      user_id: 'demo-user-4',
      report_type: 'Found',
      item_name: 'Student ID Card',
      category: 'ID cards',
      colour: 'Blue',
      description: 'Plastic ID card found outside the cafeteria with a student name visible.',
      location: 'Cafeteria',
      report_date: '2026-11-06',
      image_url: 'https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=900&q=80',
      status: 'Active',
      created_at: '2026-11-06T13:50:00Z'
    }
  ]
};
