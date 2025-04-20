import React from "react";

const Menu = () => {
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

  return (
    <div style={{ 
      backgroundColor: 'rgba(28, 32, 55, 0.7)', 
      borderRadius: '8px', 
      padding: '20px',
      margin: '20px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
    }}>
      <h1 style={{ 
        color: '#3f51b5', 
        fontSize: '24px', 
        marginBottom: '20px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '10px'
      }}>
        Restaurant Menu
      </h1>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '20px'
      }}>
        <button style={{
          backgroundColor: '#3f51b5',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: 'pointer'
        }}>
          Add New Item
        </button>

        <div style={{
          display: 'flex',
          gap: '10px'
        }}>
          <button style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Edit Menu
          </button>
          <button style={{
            backgroundColor: 'transparent',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Print Menu
          </button>
        </div>
      </div>
      
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '25px'
      }}>
        {menuCategories.map((category, i) => (
          <div key={i}>
            <h2 style={{ 
              color: 'white', 
              fontSize: '20px',
              marginBottom: '15px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              {category.name}
              <span style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontWeight: 'normal'
              }}>
                ({category.items.length} items)
              </span>
            </h2>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '15px'
            }}>
              {category.items.map((item, j) => (
                <div key={j} style={{
                  backgroundColor: 'rgba(40, 44, 68, 0.7)',
                  padding: '15px',
                  borderRadius: '6px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  position: 'relative'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <h3 style={{ 
                        color: 'white', 
                        marginBottom: '5px', 
                        fontSize: '16px'
                      }}>
                        {item.name}
                      </h3>
                      {item.popular && (
                        <span style={{
                          backgroundColor: '#ff9800',
                          color: 'white',
                          fontSize: '10px',
                          padding: '2px 6px',
                          borderRadius: '10px'
                        }}>
                          Popular
                        </span>
                      )}
                    </div>
                    <p style={{ 
                      color: 'rgba(255, 255, 255, 0.7)', 
                      fontSize: '14px' 
                    }}>
                      {item.price}
                    </p>
                  </div>
                  <div style={{
                    display: 'flex',
                    gap: '8px'
                  }}>
                    <button style={{
                      backgroundColor: 'rgba(63, 81, 181, 0.2)',
                      color: '#3f51b5',
                      border: 'none',
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      ✏️
                    </button>
                    <button style={{
                      backgroundColor: 'rgba(244, 67, 54, 0.2)',
                      color: '#f44336',
                      border: 'none',
                      width: '30px',
                      height: '30px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}>
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '20px', 
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: '14px'
      }}>
        This is a placeholder for the Menu page.
      </div>
    </div>
  );
};

export default Menu;
