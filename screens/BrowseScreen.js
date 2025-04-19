import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Geçici işletme verileri
const dummyBusinesses = [
  {
    id: "1",
    name: "Lezzet Köşesi",
    type: "Restaurant",
    rating: 4.5,
    distance: "0.3 km",
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500",
    priceRange: "₺₺",
  },
  {
    id: "2",
    name: "Kahve Durağı",
    type: "Cafe",
    rating: 4.2,
    distance: "0.5 km",
    image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500",
    priceRange: "₺",
  },
  {
    id: "3",
    name: "Pizza Express",
    type: "Restaurant",
    rating: 4.7,
    distance: "0.8 km",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500",
    priceRange: "₺₺",
  },
  {
    id: "4",
    name: "Burger House",
    type: "Fast Food",
    rating: 4.3,
    distance: "1.2 km",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
    priceRange: "₺₺",
  },
  {
    id: "5",
    name: "Tatlı Dünyası",
    type: "Dessert",
    rating: 4.6,
    distance: "1.5 km",
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=500",
    priceRange: "₺₺",
  },
  {
    id: "6",
    name: "Deniz Mahsülleri",
    type: "Restaurant",
    rating: 4.8,
    distance: "2.0 km",
    image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=500",
    priceRange: "₺₺₺",
  },
  {
    id: "7",
    name: "Kebap Evi",
    type: "Restaurant",
    rating: 4.4,
    distance: "2.3 km",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    priceRange: "₺₺",
  },
  {
    id: "8",
    name: "Çay Bahçesi",
    type: "Cafe",
    rating: 4.1,
    distance: "2.7 km",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=500",
    priceRange: "₺",
  },
  {
    id: "9",
    name: "Mangal Keyfi",
    type: "Restaurant",
    rating: 4.5,
    distance: "3.0 km",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    priceRange: "₺₺",
  },
  {
    id: "10",
    name: "Dönerci",
    type: "Fast Food",
    rating: 4.3,
    distance: "3.2 km",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=500",
    priceRange: "₺",
  },
];

export default function BrowseScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  const categories = ["All", "Restaurant", "Cafe", "Fast Food", "Dessert"];

  // İşletmeleri rating'e göre sırala ve filtrele
  useEffect(() => {
    let result = [...dummyBusinesses].sort((a, b) => b.rating - a.rating);
    
    // Kategori filtresi
    if (selectedCategory !== "All") {
      result = result.filter(business => business.type === selectedCategory);
    }
    
    // Arama filtresi
    if (searchQuery) {
      result = result.filter(business => 
        business.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBusinesses(result);
  }, [selectedCategory, searchQuery]);

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    if (category === "Restaurant") {
      navigation.navigate('BusinessList', { 
        category: 'Food & Beverages'
      });
    }
  };

  const renderBusinessItem = ({ item }) => (
    <TouchableOpacity
      style={styles.businessCard}
      onPress={() => navigation.navigate('BusinessDetail', { business: item })}
    >
      <Image source={{ uri: item.image }} style={styles.businessImage} />
      <View style={styles.businessInfo}>
        <Text style={styles.businessName}>{item.name}</Text>
        <View style={styles.businessDetails}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
          <Text style={styles.businessType}>{item.type}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
        <Text style={styles.priceRange}>{item.priceRange}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Yakınındaki İşletmeler</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="İşletme ara..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryButton,
                selectedCategory === item && styles.selectedCategory,
              ]}
              onPress={() => {
                setSelectedCategory(item);
                if (item === "Restaurant") {
                  navigation.navigate('BusinessList', { 
                    category: 'Food & Beverages'
                  });
                }
              }}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <FlatList
        data={filteredBusinesses}
        renderItem={renderBusinessItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.businessList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: "#333",
  },
  categoriesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
  },
  selectedCategory: {
    backgroundColor: "#FF6B6B",
  },
  categoryText: {
    color: "#666",
    fontSize: 14,
  },
  selectedCategoryText: {
    color: "#fff",
  },
  businessList: {
    padding: 16,
  },
  businessCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  businessImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  businessInfo: {
    flex: 1,
    padding: 12,
  },
  businessName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  businessDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 8,
  },
  ratingText: {
    marginLeft: 4,
    color: "#666",
    fontSize: 14,
  },
  businessType: {
    color: "#666",
    fontSize: 14,
    marginRight: 8,
  },
  distance: {
    color: "#666",
    fontSize: 14,
  },
  priceRange: {
    color: "#4CAF50",
    fontSize: 14,
    fontWeight: "500",
  },
});
