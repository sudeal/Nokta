import React, { useState, useEffect } from "react";
import { useLanguage } from '../contexts/LanguageContext';

const Menu = () => {
  const { translations, isEnglish } = useLanguage();
  const t = translations.menu;

  // Helper function to get the correct translation
  const getTranslation = (key) => {
    return isEnglish ? t[key].en : t[key].tr;
  };

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Load menu items on component mount
  useEffect(() => {
    // Simulate loading menu items
    setTimeout(() => {
      setMenuItems([
        {
          id: 1,
          name: 'Grilled Salmon',
          description: 'Fresh salmon with herbs and lemon',
          price: '24.99',
          category: 'mainCourses',
          image: null
        },
        {
          id: 2,
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake with ganache',
          price: '7.99',
          category: 'desserts',
          image: null
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingItem.id) {
      // Update existing item
      setMenuItems(items => 
        items.map(item => 
          item.id === editingItem.id ? editingItem : item
        )
      );
    } else {
      // Add new item
      const newItem = {
        ...editingItem,
        id: Date.now() // Simple way to generate unique ID
      };
      setMenuItems(items => [...items, newItem]);
    }
    
    setEditingItem(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem(prev => ({
          ...prev,
          image: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    if (itemToDelete) {
      setMenuItems(items => items.filter(item => item.id !== itemToDelete.id));
      setShowDeleteConfirm(false);
      setItemToDelete(null);
    }
  };

  // Mock menu categories and items
  const menuCategories = [
    {
      name: 'Main Courses',
      items: [
        { name: 'Grilled Salmon', price: '$24.99', popular: true },
        { name: 'Steak with Herb Butter', price: '$29.99', popular: true },
        { name: 'Chicken Parmesan', price: '$18.99', popular: false },
        { name: 'Vegetable Pasta', price: '$15.99', popular: false }
      ]
    },
    {
      name: 'Appetizers',
      items: [
        { name: 'Bruschetta', price: '$8.99', popular: true },
        { name: 'Calamari', price: '$12.99', popular: false },
        { name: 'Spinach Dip', price: '$9.99', popular: false }
      ]
    },
    {
      name: 'Desserts',
      items: [
        { name: 'Chocolate Cake', price: '$7.99', popular: true },
        { name: 'Cheesecake', price: '$8.99', popular: false },
        { name: 'Ice Cream', price: '$5.99', popular: false }
      ]
    }
  ];

  // Loading state
  if (loading) {
    return (
      <div style={{ 
        backgroundColor: 'rgba(28, 32, 55, 0.7)', 
        borderRadius: '8px', 
        padding: '40px',
        margin: '20px',
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          color: 'white', 
          fontSize: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255,255,255,0.3)',
            borderTop: '2px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          {getTranslation('loading')}
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // Error state
  if (error) {
  return (
    <div style={{ 
      backgroundColor: 'rgba(28, 32, 55, 0.7)', 
      borderRadius: '8px', 
      padding: '20px',
      margin: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ 
          color: '#f44336', 
        fontSize: '24px', 
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>⚠️</span> {getTranslation('error')}
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          style={{
            backgroundColor: '#3f51b5',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '15px'
          }}
        >
          {getTranslation('tryAgain')}
          </button>
        </div>
    );
  }

  return (
    <div style={{ 
      backgroundColor: 'rgba(28, 32, 55, 0.95)', 
      borderRadius: '12px', 
      padding: '0',
      margin: '20px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
        color: 'white',
        padding: '24px 30px',
        borderBottom: 'none'
      }}>
        <h1 style={{ 
          fontSize: '28px',
          fontWeight: '600',
          margin: '0',
          letterSpacing: '-0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>🍽️</span>
          {getTranslation('title')}
        </h1>
      </div>
      
      <div style={{
        padding: '30px'
      }}>
        {/* Add Item Button */}
        <button
          onClick={() => setEditingItem({})}
          style={{
            backgroundColor: '#4caf50',
              color: 'white', 
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}
        >
          <span>➕</span>
          {getTranslation('addItem')}
        </button>

        {/* Menu Items Grid */}
        {menuItems.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '40px',
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '16px'
          }}>
            {getTranslation('noMenu')}
          </div>
        ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px'
          }}>
            {menuItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'rgba(40, 44, 68, 0.8)',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
                }}
              >
                {item.image && (
                  <div style={{
                    height: '200px',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }} />
                )}
                <div style={{ padding: '20px' }}>
                  <h3 style={{
                    color: 'white',
                    margin: '0 0 10px 0',
                    fontSize: '18px'
                  }}>
                    {item.name}
                  </h3>
                  <p style={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    margin: '0 0 15px 0',
                    fontSize: '14px'
                  }}>
                    {item.description}
                  </p>
                  <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      color: '#4caf50',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      {item.price} TL
                    </span>
                    <div style={{
                      display: 'flex',
                      gap: '8px'
                    }}>
                      <button
                        onClick={() => setEditingItem(item)}
                        style={{
                          backgroundColor: '#2196f3',
                        color: 'white', 
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        {getTranslation('editItem')}
                      </button>
                      <button
                        onClick={() => {
                          setItemToDelete(item);
                          setShowDeleteConfirm(true);
                        }}
                        style={{
                          backgroundColor: '#f44336',
                          color: 'white',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '14px'
                        }}
                      >
                        {getTranslation('deleteItem')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit/Add Item Modal */}
        {editingItem && (
                  <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'rgba(28, 32, 55, 0.95)',
              borderRadius: '12px',
              padding: '30px',
              width: '90%',
              maxWidth: '500px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <h2 style={{
                color: 'white',
                margin: '0 0 20px 0',
                fontSize: '24px'
              }}>
                {editingItem.id ? getTranslation('editItem') : getTranslation('addItem')}
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {getTranslation('form.name')}
                  </label>
                  <input
                    type="text"
                    value={editingItem.name || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    placeholder={getTranslation('form.namePlaceholder')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {getTranslation('form.description')}
                  </label>
                  <textarea
                    value={editingItem.description || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    placeholder={getTranslation('form.descriptionPlaceholder')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white',
                      minHeight: '100px'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {getTranslation('form.price')}
                  </label>
                  <input
                    type="number"
                    value={editingItem.price || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, price: e.target.value })}
                    placeholder={getTranslation('form.pricePlaceholder')}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    required
                  />
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {getTranslation('form.category')}
                  </label>
                  <select
                    value={editingItem.category || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                    required
                  >
                    <option value="">{getTranslation('form.categoryPlaceholder')}</option>
                    {Object.entries(t.categories).map(([key, value]) => (
                      <option key={key} value={key}>
                        {isEnglish ? value.en : value.tr}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    color: 'white',
                    marginBottom: '8px'
                  }}>
                    {getTranslation('form.image')}
                  </label>
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      color: 'white'
                    }}
                  />
                </div>
                <div style={{
                      display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '10px'
                }}>
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {getTranslation('cancel')}
                    </button>
                  <button
                    type="submit"
                    style={{
                      backgroundColor: '#4caf50',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {getTranslation('save')}
                    </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              backgroundColor: 'rgba(28, 32, 55, 0.95)',
              borderRadius: '12px',
              padding: '30px',
              width: '90%',
              maxWidth: '400px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
            }}>
              <h2 style={{
                color: 'white',
                margin: '0 0 20px 0',
                fontSize: '24px'
              }}>
                {getTranslation('confirmations.deleteTitle')}
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                margin: '0 0 20px 0'
              }}>
                {getTranslation('confirmations.deleteMessage')}
              </p>
      <div style={{ 
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '10px'
              }}>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {getTranslation('confirmations.deleteCancel')}
                </button>
                <button
                  onClick={handleDelete}
                  style={{
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  {getTranslation('confirmations.deleteConfirm')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Menu;
